import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#111827] text-gray-200 font-sans">
      {/* Left Sidebar */}
      <AdminSidebar />
      
      {/* Right Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <AdminHeader />
        
        {/* Main page content scroll region */}
        <main className="flex-grow p-8 bg-[#1f2937] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
