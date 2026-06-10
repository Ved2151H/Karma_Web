import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, ShieldAlert } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-neutral-400 pt-16 pb-8 border-t border-neutral-900 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 xl:gap-12 mb-12">
          {/* Column 1: Categories */}
          <div>
            <h4 className="text-white font-display text-sm font-bold tracking-widest uppercase mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs lg:text-sm">
              <li>
                <Link to="/category/face" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Face Protection
                </Link>
              </li>
              <li>
                <Link to="/category/foot" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Foot Protection
                </Link>
              </li>
              <li>
                <Link to="/category/eye" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Eye Protection
                </Link>
              </li>
              <li>
                <Link to="/category/hand" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Hand Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-white font-display text-sm font-bold tracking-widest uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs lg:text-sm">
              <li>
                <a href="#about" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  About KARAM
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  News & Media
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-display text-sm font-bold tracking-widest uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs lg:text-sm">
              <li>
                <a href="#faqs" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#track" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-brand-red hover:underline transition-colors duration-200">
                  Returns & Replacements
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-brand-red w-6 h-6" />
              <span className="text-white font-display text-lg font-bold tracking-tight">
                KARAM <span className="text-brand-red">PPE</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Global leaders in personal protective equipment. Providing state of the art safety solutions.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-brand-red transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-brand-red transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-brand-red transition-all cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} KARAM Safety. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-neutral-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-neutral-300">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
