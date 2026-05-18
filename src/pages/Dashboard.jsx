import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller';

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  // Product form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', price: '', category: '', pages: '', stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [axios.get('/products')];

        if (isAdmin) {
          promises.push(
            axios.get('/orders'),
            axios.get('/orders/admin/stats'),
            axios.get('/orders/admin/users')
          );
        }
        if (isSeller) {
          promises.push(axios.get('/products/myproducts'));
          promises.push(axios.get('/orders/seller-orders'));
        }

        const [productsRes, ...rest] = await Promise.all(promises);

        if (isAdmin) {
          setOrders(rest[0].data);
          setStats(rest[1].data);
          setUsers(rest[2].data);
          setProducts(productsRes.data);
        } else if (isSeller) {
          setProducts(rest[0].data);
          setOrders(rest[1].data);
        } else {
          setProducts(productsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, isSeller]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (bookFile) fd.append('file', bookFile);

      await axios.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowForm(false);
      setFormData({ title: '', author: '', description: '', price: '', category: '', pages: '', stock: '' });
      setImageFile(null);
      setBookFile(null);

      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateOrder = async (id) => {
    try {
      await axios.put(`/orders/${id}/deliver`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'completed' } : o));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-library-200 border-t-library-500 rounded-full animate-spin" />
          <p className="text-ink-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📚' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    ...(isAdmin ? [{ id: 'users', label: 'Users', icon: '👥' }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink-800">
            {isAdmin ? 'Admin' : 'Seller'} Dashboard
          </h1>
          <p className="text-ink-500 text-sm mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        {isSeller && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Book
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-ink-100 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-white text-ink-800 shadow-sm'
                : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-library-200 p-6 mb-8 animate-fade-in">
          <h3 className="font-heading font-bold text-ink-800 text-lg mb-6">Add New Book</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleFormChange} required
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Author</label>
                <input type="text" name="author" value={formData.author} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Price ($)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} required
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleFormChange} required
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none">
                  <option value="">Select category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Technology">Technology</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Philosophy">Philosophy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Pages</label>
                <input type="number" name="pages" value={formData.pages} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} rows={3} required
                className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Cover Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-library-50 file:text-library-700 file:font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Digital File</label>
                <input type="file" accept=".pdf,.epub,.mobi" onChange={e => setBookFile(e.target.files[0])}
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-library-50 file:text-library-700 file:font-medium" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={formLoading}
                className="px-6 py-2.5 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors disabled:opacity-50">
                {formLoading ? 'Adding...' : 'Add Book'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-library-200 text-ink-600 rounded-xl font-semibold hover:bg-library-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-8">
          {isAdmin && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Products', value: stats.totalProducts, icon: '📚', color: 'from-blue-400 to-blue-600' },
                { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'from-emerald-400 to-emerald-600' },
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-purple-400 to-purple-600' },
                { label: 'Revenue', value: `$${stats.totalRevenue?.toFixed(2) || '0.00'}`, icon: '💰', color: 'from-amber-400 to-amber-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-library-200 p-5 card-hover">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg`}>
                      {s.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-ink-800">{s.value}</p>
                  <p className="text-sm text-ink-500">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {isSeller && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'My Products', value: products.length, icon: '📚', color: 'from-blue-400 to-blue-600' },
                { label: 'Orders Received', value: orders.length, icon: '📦', color: 'from-emerald-400 to-emerald-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-library-200 p-5 card-hover">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-bold text-ink-800">{s.value}</p>
                  <p className="text-sm text-ink-500">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {isAdmin && users.length > 0 && (
            <div className="bg-white rounded-xl border border-library-200 p-6">
              <h3 className="font-heading font-bold text-ink-800 text-lg mb-4">Recent Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-library-200 text-left">
                      <th className="py-3 px-2 text-ink-500 font-medium">Name</th>
                      <th className="py-3 px-2 text-ink-500 font-medium">Email</th>
                      <th className="py-3 px-2 text-ink-500 font-medium">Role</th>
                      <th className="py-3 px-2 text-ink-500 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map(u => (
                      <tr key={u._id} className="border-b border-library-100 hover:bg-library-50">
                        <td className="py-3 px-2 font-medium text-ink-800">{u.name}</td>
                        <td className="py-3 px-2 text-ink-500">{u.email}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-ink-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="bg-white rounded-xl border border-library-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-library-50 text-left">
                  <th className="py-3 px-4 text-ink-500 font-medium">Title</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Author</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Category</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Price</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Stock</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-ink-500">
                      No products yet
                    </td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p._id} className="border-b border-library-100 hover:bg-library-50">
                      <td className="py-3 px-4 font-medium text-ink-800">{p.title}</td>
                      <td className="py-3 px-4 text-ink-500">{p.author || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-library-100 text-library-700 px-2 py-1 rounded-full">{p.category}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold">${p.price}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-500 hover:text-red-600 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="bg-white rounded-xl border border-library-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-library-50 text-left">
                  <th className="py-3 px-4 text-ink-500 font-medium">Order ID</th>
                  {isAdmin && <th className="py-3 px-4 text-ink-500 font-medium">Customer</th>}
                  <th className="py-3 px-4 text-ink-500 font-medium">Items</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Total</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Status</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Date</th>
                  {isAdmin && <th className="py-3 px-4 text-ink-500 font-medium">Action</th>}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-ink-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} className="border-b border-library-100 hover:bg-library-50">
                      <td className="py-3 px-4 font-mono text-xs text-ink-500">#{order._id.slice(-8)}</td>
                      {isAdmin && <td className="py-3 px-4 text-ink-800">{order.user?.name || 'N/A'}</td>}
                      <td className="py-3 px-4 text-ink-600">{order.products?.length || 0}</td>
                      <td className="py-3 px-4 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ink-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateOrder(order._id)}
                              className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                            >
                              Mark Complete
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab (Admin only) */}
      {tab === 'users' && isAdmin && (
        <div className="bg-white rounded-xl border border-library-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-library-50 text-left">
                  <th className="py-3 px-4 text-ink-500 font-medium">Name</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Email</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Role</th>
                  <th className="py-3 px-4 text-ink-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-library-100 hover:bg-library-50">
                    <td className="py-3 px-4 font-medium text-ink-800">{u.name}</td>
                    <td className="py-3 px-4 text-ink-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;