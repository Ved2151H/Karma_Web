import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, FolderTree, ClipboardList, Users, ShieldAlert, Loader } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { dashboardApi } from '../../api/dashboardApi';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (error) {
        console.warn('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats?.products ?? '—', description: 'Equipment items in catalog', icon: ShoppingBag },
    { label: 'Total Categories', value: stats?.categories ?? '—', description: 'Active safety divisions', icon: FolderTree },
    { label: 'Orders', value: stats?.orders ?? '—', description: 'Total customer purchases', icon: ClipboardList },
    { label: 'Users', value: stats?.users ?? '—', description: 'Registered customer accounts', icon: Users },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="font-sans space-y-8"
    >
      <div className="select-none">
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-xs mt-1">Live counts from your connected database.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-xs py-8">
          <Loader className="w-4 h-4 animate-spin" />
          Loading dashboard stats...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <StatCard
                label={stat.label}
                value={String(stat.value)}
                description={stat.description}
                icon={stat.icon}
              />
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 select-none">
          <ShieldAlert className="w-5 h-5 text-brand-red" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">System Status</h3>
        </div>
        <p className="text-gray-400 text-xs">
          Backend API and Neon database are connected. Audit log streaming can be added in a future update.
        </p>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
