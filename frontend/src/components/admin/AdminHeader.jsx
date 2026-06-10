import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-20 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-8 text-white select-none font-sans">
      <div>
        <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-white">
          Admin Panel
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">
          Welcome Admin
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-gray-800/40 px-3 py-1.5 rounded-md border border-gray-700/50">
          <User className="w-3.5 h-3.5 text-brand-red" />
          <span>{user?.name || 'Administrator'}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-brand-red cursor-pointer transition-colors duration-200"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
