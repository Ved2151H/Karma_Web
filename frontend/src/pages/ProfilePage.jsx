import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { User, Mail, Phone, Shield, Loader, CheckCircle } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuthContext();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await userApi.getProfile();
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
        });
      } catch {
        if (user) {
          setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const updated = await userApi.update(user.id, {
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, '') || null,
      });
      localStorage.setItem('user', JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-neutral-400 text-xs">
        <Loader className="w-4 h-4 animate-spin" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen font-sans select-none pb-16">
      <div className="max-w-[640px] mx-auto px-5 py-12">
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-800 mb-2">My Profile</h1>
        <p className="text-neutral-400 text-xs mb-8">Manage your account details.</p>

        {saved && (
          <div className="mb-6 flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            Profile updated successfully.
          </div>
        )}
        {error && (
          <div className="mb-6 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs font-semibold">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs text-neutral-500 pb-4 border-b border-neutral-200">
            <Shield className="w-4 h-4" />
            <span>Role: <strong className="text-neutral-700">{user?.role}</strong></span>
          </div>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Name</span>
            <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#E31E24]" />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
            <input disabled value={form.email} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-500 cursor-not-allowed" />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</span>
            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} maxLength="10" className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#E31E24]" placeholder="10 digit number" />
          </label>

          <button type="submit" disabled={saving} className="w-full bg-[#E31E24] hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
