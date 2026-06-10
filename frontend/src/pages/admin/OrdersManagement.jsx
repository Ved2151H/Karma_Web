import React, { useState } from 'react';
import { Search, CheckCircle2, Truck, XCircle, AlertCircle, Loader } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useAdminOrders';

function OrdersManagement() {
  const { orders, loading, error, updateOrderStatus } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch {
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="font-sans space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">Orders log</h1>
          <p className="text-gray-400 text-xs mt-1">Review customer transactions and dispatch shipping statuses.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-2 select-none w-full md:w-auto shrink-0 justify-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1f2937]/50 border border-gray-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-brand-red cursor-pointer"
          >
            <option value="all">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-400 text-xs">
            <Loader className="w-4 h-4 animate-spin" />
            Loading orders...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-400 select-none">
              <thead className="bg-[#1f2937]/50 text-gray-300 uppercase font-bold text-[10px] tracking-wider border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3.5">Order ID</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-gray-350">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    let statusClass = 'bg-gray-800 text-gray-400 border border-gray-750';
                    let StatusIcon = AlertCircle;

                    if (ord.status === 'Processing') {
                      statusClass = 'bg-orange-950/40 text-orange-400 border border-orange-500/20';
                      StatusIcon = AlertCircle;
                    } else if (ord.status === 'Shipped') {
                      statusClass = 'bg-blue-950/40 text-blue-400 border border-blue-500/20';
                      StatusIcon = Truck;
                    } else if (ord.status === 'Completed') {
                      statusClass = 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
                      StatusIcon = CheckCircle2;
                    } else if (ord.status === 'Cancelled') {
                      statusClass = 'bg-red-950/40 text-red-400 border border-red-500/20';
                      StatusIcon = XCircle;
                    }

                    return (
                      <tr key={ord.id} className="hover:bg-gray-850/20 transition-colors">
                        <td className="px-4 py-4 font-mono font-bold text-white shrink-0">
                          {ord.orderNumber}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{ord.customer}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{ord.email}</div>
                        </td>
                        <td className="px-4 py-4 font-bold text-white">
                          ₹{ord.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusClass}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{ord.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-4 font-mono text-gray-400">
                          {ord.date}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex gap-2 justify-end items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-550 hidden sm:inline">Set Status:</span>
                            <select
                              value={ord.status}
                              disabled={updatingId === ord.id}
                              onChange={(e) => updateStatus(ord.id, e.target.value)}
                              className="bg-[#1f2937]/50 border border-gray-800 text-[10px] text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-brand-red cursor-pointer disabled:opacity-60"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersManagement;
