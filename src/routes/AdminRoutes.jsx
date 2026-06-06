import React from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../constants/roles';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, ShoppingBag, FolderTree, ClipboardList, Users, LogOut } from 'lucide-react';

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#121212] text-neutral-250 font-sans">
      
      {/* Dark Sidebar Section */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-neutral-800 flex flex-col shrink-0 select-none">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-neutral-800">
          <Link to="/" className="text-lg font-black tracking-widest text-white uppercase block hover:text-brand-red transition-colors">
            KARAM <span className="text-brand-red">PORTAL</span>
          </Link>
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1 block">
            Administrator Console
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-205 ${
                    isActive
                      ? 'bg-brand-red text-white shadow-md'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Logout Trigger */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-neutral-400 hover:bg-red-950/20 hover:text-brand-red cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-8 overflow-y-auto bg-[#121212]">
        <Outlet />
      </main>

    </div>
  );
}

export function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
      <AdminLayout />
    </ProtectedRoute>
  );
}

export default AdminRoutes;
