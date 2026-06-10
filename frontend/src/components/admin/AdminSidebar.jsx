import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, ClipboardList, Users, Settings, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-[280px] bg-[#111827] text-gray-300 flex flex-col h-screen shrink-0 select-none border-r border-gray-800 font-sans">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="text-xl font-black tracking-widest text-white uppercase block hover:text-brand-red transition-colors">
          KARAM <span className="text-brand-red">ADMIN</span>
        </Link>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 block">
          Control Management
        </span>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-red text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-red-950/20 hover:text-brand-red cursor-pointer transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
