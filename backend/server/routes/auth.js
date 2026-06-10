import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../../lib/prisma.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { verifyFirebaseIdToken } from '../services/firebaseAdmin.js';
import {
  signAccessToken,
  createRefreshTokenValue,
  getRefreshTokenExpiry,
} from '../utils/jwt.js';
import { formatAuthUser } from '../utils/formatters.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

function resolveLoginEmail({ email, username }) {
  if (email) return email.trim().toLowerCase();
  if (username === 'admin') return 'admin@karam.in';
  if (username) return username.includes('@') ? username.trim().toLowerCase() : `${username.trim()}@karam.in`;
  return null;
}

function extractPhoneFromEmail(email) {
  const match = email?.match(/^(\d{10})@karam\.in$/);
  return match ? match[1] : null;
}

async function issueTokens(user) {
  const token = signAccessToken(user);
  const refreshToken = createRefreshTokenValue();

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return { token, refreshToken, user: formatAuthUser(user) };
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, ...(phone ? [{ phone }] : [])],
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || null,
        passwordHash: hashPassword(password),
        role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
      },
    });

    res.status(201).json(await issueTokens(user));
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;
    const loginEmail = resolveLoginEmail({ email, username });

    if (!loginEmail) {
      return res.status(400).json({ message: 'Email or username is required' });
    }

    let user = await prisma.user.findUnique({ where: { email: loginEmail } });
    const phone = extractPhoneFromEmail(loginEmail);

    if (!user && phone) {
      user = await prisma.user.findUnique({ where: { phone } });
    }

    if (password) {
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (user.status === 'BANNED') {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    res.json(await issueTokens(user));
  })
);

function normalizeIndianPhone(phoneNumber) {
  if (!phoneNumber) return null;
  const digits = String(phoneNumber).replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return null;
}

router.post(
  '/firebase',
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    const decoded = await verifyFirebaseIdToken(idToken);
    const phone = normalizeIndianPhone(decoded.phone_number);

    if (!phone) {
      return res.status(400).json({ message: 'Verified phone number is missing or invalid' });
    }

    const email = `${phone}@karam.in`;
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ phone }, { email }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `KARAM Member ${phone.slice(-4)}`,
          email,
          phone,
          passwordHash: hashPassword(crypto.randomBytes(24).toString('hex')),
          role: 'CUSTOMER',
        },
      });
    } else if (!user.phone) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { phone },
      });
    }

    if (user.status === 'BANNED') {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    res.json(await issueTokens(user));
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    await prisma.refreshToken.delete({ where: { id: stored.id } });
    res.json(await issueTokens(stored.user));
  })
);

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  res.json({ success: true });
});

export default router;
