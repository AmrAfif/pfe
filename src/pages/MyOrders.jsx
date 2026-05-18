import { useEffect, useState } from 'react';
import axios from '../api/axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/orders/myorders');
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-library-200 border-t-library-500 rounded-full animate-spin" />
          <p className="text-ink-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <svg className="w-24 h-24 text-library-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <h2 className="text-2xl font-heading font-bold text-ink-800 mb-2">No Orders Yet</h2>
        <p className="text-ink-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-ink-800">My Orders</h1>
        <p className="text-ink-500 text-sm mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-xl border border-library-200 p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-ink-500 font-mono">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-ink-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-ink-700">{item.product?.title || 'Product'} x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-library-200 mt-4 pt-4 flex justify-between items-center">
              <span className="text-sm text-ink-500">Total</span>
              <span className="text-xl font-bold text-library-600">${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;