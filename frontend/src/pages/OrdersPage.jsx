import React from 'react';
import { Link } from 'react-router-dom';
import { Loader, Package, XCircle } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';

function statusColor(status) {
  if (status === 'Delivered' || status === 'Completed') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (status === 'Cancelled') return 'bg-red-50 text-red-600 border-red-100';
  if (status === 'Shipped' || status === 'Dispatched') return 'bg-blue-50 text-blue-600 border-blue-100';
  return 'bg-orange-50 text-orange-600 border-orange-100';
}

export function OrdersPage() {
  const { orders, loading, error, cancelOrder } = useOrders();

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await cancelOrder(orderId);
    } catch {
      alert('Failed to cancel order.');
    }
  };

  return (
    <div className="w-full bg-white min-h-screen font-sans select-none pb-16">
      <div className="max-w-[900px] mx-auto px-5 py-12">
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-800 mb-2">My Orders</h1>
        <p className="text-neutral-400 text-xs mb-8">Track your purchase history and order status.</p>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-neutral-400 text-xs">
            <Loader className="w-4 h-4 animate-spin" />
            Loading orders...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500 text-xs font-semibold bg-red-50 rounded-2xl border border-red-100">{error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm font-medium">No orders yet.</p>
            <Link to="/" className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-[#E31E24] hover:underline">Continue Shopping</Link>
          </div>
        )}

        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="border border-neutral-100 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-100">
                <div>
                  <p className="text-xs font-bold text-neutral-800">{order.orderNumber || order.id}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-black text-neutral-800">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={`${order.id}-${item.id}`} className="flex justify-between text-xs text-neutral-600">
                    <span className="truncate pr-4">{item.title} × {item.quantity}</span>
                    <span className="font-semibold shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {!['Delivered', 'Cancelled', 'Completed'].includes(order.status) && (
                <button
                  onClick={() => handleCancel(order.id)}
                  className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
