import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, User, UserCheck, UserX, Trash2 } from 'lucide-react';

function UsersManagement() {
  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Rajesh Sharma', email: 'rajesh@gmail.com', role: 'Customer', status: 'Active' },
    { id: 'usr-2', name: 'Vikram Singh', email: 'vikram@karam.in', role: 'Admin', status: 'Active' },
    { id: 'usr-3', name: 'Anjali Verma', email: 'anjali@karam.in', role: 'Manager', status: 'Active' },
    { id: 'usr-4', name: 'Dev Dhanokar', email: 'dev@gmail.com', role: 'Customer', status: 'Active' },
    { id: 'usr-5', name: 'Suresh Kumar', email: 'suresh@blocked.com', role: 'Customer', status: 'Banned' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Actions
  const toggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Banned' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const changeRole = (userId, newRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="font-sans space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">Registered Users</h1>
          <p className="text-gray-400 text-xs mt-1">Review active member accounts, suspend privileges, and modify authorization roles.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 select-none w-full md:w-auto shrink-0 justify-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#1f2937]/50 border border-gray-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-brand-red cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-400 select-none">
            <thead className="bg-[#1f2937]/50 text-gray-300 uppercase font-bold text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-gray-350">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500 font-medium">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isActive = u.status === 'Active';
                  const statusClass = isActive 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-950/40 text-red-400 border border-red-500/20';

                  const roleClass = u.role === 'Admin'
                    ? 'text-brand-red font-extrabold'
                    : u.role === 'Manager'
                    ? 'text-blue-400 font-semibold'
                    : 'text-gray-400';

                  return (
                    <tr key={u.id} className="hover:bg-gray-850/20 transition-colors">
                      {/* Name */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[10px] font-mono text-gray-500 mt-0.5">{u.id}</div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 font-mono text-gray-400">
                        {u.email}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          {u.role === 'Admin' ? (
                            <Shield className="w-3.5 h-3.5 text-brand-red" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-gray-550" />
                          )}
                          <span className={roleClass}>{u.role}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusClass}`}>
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-2.5 justify-end items-center">
                          {/* Role Selector */}
                          <select
                            value={u.role}
                            onChange={(e) => changeRole(u.id, e.target.value)}
                            className="bg-[#1f2937]/50 border border-gray-800 text-[10px] text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-brand-red cursor-pointer"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Customer">Customer</option>
                          </select>

                          {/* Ban/Unban Button */}
                          <button
                            onClick={() => toggleStatus(u.id)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              isActive 
                                ? 'bg-red-950/20 text-brand-red hover:bg-brand-red hover:text-white' 
                                : 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-400 hover:text-white'
                            }`}
                            title={isActive ? 'Ban User' : 'Activate User'}
                          >
                            {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-2 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersManagement;
