import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, FolderTree, ClipboardList, Users, ShieldAlert } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';

function AdminDashboard() {
  const stats = [
    { label: 'Total Products', value: '150', description: 'Equipment items in catalog', icon: ShoppingBag },
    { label: 'Total Categories', value: '10', description: 'Active safety divisions', icon: FolderTree },
    { label: 'Orders', value: '50', description: 'Total customer purchases', icon: ClipboardList },
    { label: 'Users', value: '500', description: 'Registered store accounts', icon: Users }
  ];

  const recentLogs = [
    { id: 1, time: '2026-06-06 16:45', user: 'admin', action: 'Modified price of HS61 Gloves', ip: '192.168.1.55', status: 'SUCCESS' },
    { id: 2, time: '2026-06-06 15:20', user: 'admin', action: 'Added Category: Fall Protection', ip: '192.168.1.55', status: 'SUCCESS' },
    { id: 3, time: '2026-06-06 12:10', user: 'admin', action: 'Updated Settings - Store Name', ip: '192.168.1.55', status: 'SUCCESS' },
    { id: 4, time: '2026-06-06 10:05', user: 'admin', action: 'Login Successful', ip: '192.168.1.12', status: 'SUCCESS' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="font-sans space-y-8"
    >
      {/* Dashboard Title Header */}
      <div className="select-none">
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-xs mt-1">Real-time indicators and operational audit log telemetry.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <StatCard
              label={stat.label}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
            />
          </motion.div>
        ))}
      </div>

      {/* Audit Logs Table Card */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6 select-none">
          <ShieldAlert className="w-5 h-5 text-brand-red" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Recent Audit Logs
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-400 select-none">
            <thead className="bg-[#1f2937]/50 text-gray-300 uppercase font-bold text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-4 py-3.5">IP Address</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-gray-350">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="px-4 py-4 font-mono text-gray-400">{log.time}</td>
                  <td className="px-4 py-4 font-semibold text-white">{log.user}</td>
                  <td className="px-4 py-4">{log.action}</td>
                  <td className="px-4 py-4 font-mono text-[11px] text-gray-500">{log.ip}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
