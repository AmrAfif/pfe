import { useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import {
  LayoutDashboard, BookOpen, ShoppingBag, Users, Tags, Plus, Pencil, Trash2, X, Check,
  AlertCircle, Package, DollarSign, TrendingUp, UserPlus, BookMarked, Search,
  RefreshCw, Save, Loader2, ArrowUpDown, Filter, Eye, EyeOff, BookTemplate
} from 'lucide-react';

const roleBadge = (role) => {
  const styles = {
    admin: 'bg-purple-100 text-purple-700',
    seller: 'bg-blue-100 text-blue-700',
    client: 'bg-green-100 text-green-700',
  };
  return styles[role] || 'bg-gray-100 text-gray-700';
};

const statusBadge = (status) => {
  const styles = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
};

const stockBadge = (stock) => stock > 0
  ? 'bg-green-100 text-green-700'
  : 'bg-red-100 text-red-700';

const TABS = {
  admin: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: BookOpen },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tags },
  ],
  seller: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: BookOpen },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ],
};

const defaultProductForm = { title: '', author: '', description: '', price: '', category: '', pages: '', stock: '' };

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller';
  const tabs = isAdmin ? TABS.admin : TABS.seller;

  // State
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [imageFile, setImageFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormErrors, setProductFormErrors] = useState({});

  // Category form
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');

  // User form
  const [editingUser, setEditingUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [userFormError, setUserFormError] = useState('');

  const toast = useToast();
  const { confirm } = useConfirm();

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = [axios.get('/api/categories')];

      if (isAdmin) {
        promises.push(
          axios.get('/api/products'),
          axios.get('/api/orders'),
          axios.get('/api/orders/admin/stats'),
          axios.get('/api/users'),
        );
      } else if (isSeller) {
        promises.push(
          axios.get('/api/products/myproducts'),
          axios.get('/api/orders/seller-orders'),
          axios.get('/api/products'),
        );
      }

      const [catRes, ...rest] = await Promise.all(promises);
      setCategories(catRes.data);

      if (isAdmin) {
        setProducts(rest[0].data);
        setOrders(rest[1].data);
        setStats(rest[2].data);
        setUsers(rest[3].data);
      } else if (isSeller) {
        setProducts(rest[0].data);
        setOrders(rest[1].data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isSeller]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Form helpers
  const resetProductForm = () => {
    setProductForm(defaultProductForm);
    setImageFile(null);
    setBookFile(null);
    setEditingProduct(null);
    setShowProductForm(false);
    setProductFormErrors({});
  };

  const validateProductForm = () => {
    const errs = {};
    if (!productForm.title.trim()) errs.title = 'Title is required';
    if (!productForm.price || Number(productForm.price) <= 0) errs.price = 'Valid price is required';
    if (!productForm.category) errs.category = 'Category is required';
    if (!productForm.description.trim()) errs.description = 'Description is required';
    setProductFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openEditProduct = (p) => {
    setProductForm({
      title: p.title || '',
      author: p.author || '',
      description: p.description || '',
      price: p.price ?? '',
      category: p.category || '',
      pages: p.pages ?? '',
      stock: p.stock ?? '',
    });
    setEditingProduct(p);
    setShowProductForm(true);
    setProductFormErrors({});
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;
    setProductFormLoading(true);
    setProductFormErrors({});
    try {
      const fd = new FormData();
      Object.entries(productForm).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (bookFile) fd.append('file', bookFile);

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/api/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      resetProductForm();
      const endpoint = isAdmin
        ? axios.get('/api/products')
        : axios.get('/api/products/myproducts');
      const res = await endpoint;
      setProducts(res.data);
    } catch (err) {
      setProductFormErrors({ _general: err.response?.data?.message || 'Failed to save product' });
    } finally {
      setProductFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = await confirm({
      title: 'Delete product',
      description: 'This action cannot be undone. Do you want to remove this product?',
      confirmText: 'Delete product',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.addToast('Product deleted successfully.', { type: 'success' });
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to delete product.', { type: 'error' });
    }
  };

  const handleOrderAction = async (id, status) => {
    try {
      if (status === 'completed') await axios.put(`/api/orders/${id}/deliver`);
      else await axios.put(`/api/orders/${id}/cancel`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.addToast(`Order ${status === 'completed' ? 'completed' : 'cancelled'} successfully.`, { type: 'success' });
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to update order.', { type: 'error' });
    }
  };

  const handleDeleteOrder = async (id) => {
    const confirmed = await confirm({
      title: 'Delete order',
      description: 'This order will be permanently removed. Continue?',
      confirmText: 'Delete order',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;

    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.addToast('Order deleted successfully.', { type: 'success' });
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to delete order.', { type: 'error' });
    }
  };

  // Category handlers
  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCatError('');
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setCatLoading(true);
    setCatError('');
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, { name: categoryName.trim() });
        toast.addToast('Category updated successfully.', { type: 'success' });
      } else {
        await axios.post('/api/categories', { name: categoryName.trim() });
        toast.addToast('Category created successfully.', { type: 'success' });
      }
      resetCategoryForm();
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setCatError(err.response?.data?.message || 'Failed to save category');
      toast.addToast(err.response?.data?.message || 'Failed to save category.', { type: 'error' });
    } finally {
      setCatLoading(false);
    }
  };

  const openEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryName(c.name);
    setCatError('');
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = await confirm({
      title: 'Delete category',
      description: 'This category will be permanently removed. Do you want to continue?',
      confirmText: 'Delete category',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;

    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.addToast('Category deleted successfully.', { type: 'success' });
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to delete category.', { type: 'error' });
    }
  };

  // User handlers
  const resetUserForm = () => {
    setEditingUser(null);
    setShowUserForm(false);
    setUserForm({ name: '', email: '', password: '', role: 'client' });
    setUserFormError('');
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) {
      setUserFormError('Name and email are required');
      return;
    }
    if (!editingUser && userForm.password.length < 6) {
      setUserFormError('Password must be at least 6 characters');
      return;
    }
    setUserFormLoading(true);
    setUserFormError('');
    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser._id}`, { role: userForm.role });
        toast.addToast('User role updated successfully.', { type: 'success' });
      } else {
        await axios.post('/api/users', {
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          role: userForm.role || 'client',
        });
        toast.addToast('User created successfully.', { type: 'success' });
      }
      resetUserForm();
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      setUserFormError(err.response?.data?.message || 'Failed to save user');
      toast.addToast(err.response?.data?.message || 'Failed to save user.', { type: 'error' });
    } finally {
      setUserFormLoading(false);
    }
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    setUserForm({ name: u.name, email: u.email, password: '', role: u.role });
    setShowUserForm(true);
    setUserFormError('');
  };

  const handleDeleteUser = async (id) => {
    if (!id) {
      toast.addToast('Unable to delete user: invalid id.', { type: 'error' });
      return;
    }

    const confirmed = await confirm({
      title: 'Delete user',
      description: 'This user will be permanently removed from the system.',
      confirmText: 'Delete user',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;

    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.addToast('User deleted successfully.', { type: 'success' });
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to delete user.', { type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-library-500 animate-spin" />
          <p className="text-ink-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && tab === 'overview') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Error loading dashboard</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button onClick={fetchData} className="mt-3 text-sm text-red-700 underline hover:text-red-800 flex items-center gap-1">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Global error banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink-800">
            {isAdmin ? 'Admin' : 'Seller'} Dashboard
          </h1>
          <p className="text-ink-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-2.5 border border-library-200 rounded-xl text-ink-500 hover:text-ink-700 hover:bg-library-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          {(isAdmin || isSeller) && (
            <button
              onClick={() => { resetProductForm(); setShowProductForm(true); }}
              className="px-4 py-2.5 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Book
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => { resetUserForm(); setShowUserForm(true); }}
              className="px-4 py-2.5 bg-ink-700 text-white rounded-xl font-semibold hover:bg-ink-800 transition-colors flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-ink-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                tab === t.id ? 'bg-white text-ink-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ========== ADD/EDIT PRODUCT FORM (MODAL) ========== */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={resetProductForm}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-library-200">
              <h3 className="text-lg font-heading font-bold text-ink-800 flex items-center gap-2">
                {editingProduct ? <Pencil className="w-5 h-5 text-library-500" /> : <Plus className="w-5 h-5 text-library-500" />}
                {editingProduct ? 'Edit Book' : 'Add New Book'}
              </h3>
              <button onClick={resetProductForm} className="text-ink-400 hover:text-ink-600"><X className="w-5 h-5" /></button>
            </div>

            {productFormErrors._general && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{productFormErrors._general}</p>
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Title <span className="text-red-400">*</span></label>
                  <input type="text" name="title" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm ${productFormErrors.title ? 'border-red-300 bg-red-50' : 'border-library-200'}`} />
                  {productFormErrors.title && <p className="text-xs text-red-500 mt-1">{productFormErrors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Author</label>
                  <input type="text" name="author" value={productForm.author} onChange={e => setProductForm({ ...productForm, author: e.target.value })}
                    className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Price ($) <span className="text-red-400">*</span></label>
                  <input type="number" step="0.01" name="price" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm ${productFormErrors.price ? 'border-red-300 bg-red-50' : 'border-library-200'}`} />
                  {productFormErrors.price && <p className="text-xs text-red-500 mt-1">{productFormErrors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Category <span className="text-red-400">*</span></label>
                  <select name="category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm ${productFormErrors.category ? 'border-red-300 bg-red-50' : 'border-library-200'}`}>
                    <option value="">-- Select category --</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                  {productFormErrors.category && <p className="text-xs text-red-500 mt-1">{productFormErrors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Pages</label>
                  <input type="number" name="pages" value={productForm.pages} onChange={e => setProductForm({ ...productForm, pages: e.target.value })}
                    className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Stock</label>
                  <input type="number" name="stock" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm ${productFormErrors.description ? 'border-red-300 bg-red-50' : 'border-library-200'}`} />
                {productFormErrors.description && <p className="text-xs text-red-500 mt-1">{productFormErrors.description}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Cover Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                    className="w-full px-4 py-2.5 border border-library-200 rounded-xl outline-none text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-library-50 file:text-library-700 file:font-medium file:text-xs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1">Digital File (PDF, EPUB, MOBI)</label>
                  <input type="file" accept=".pdf,.epub,.mobi" onChange={e => setBookFile(e.target.files[0])}
                    className="w-full px-4 py-2.5 border border-library-200 rounded-xl outline-none text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-library-50 file:text-library-700 file:font-medium file:text-xs" />
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-library-100">
                <button type="submit" disabled={productFormLoading}
                  className="px-6 py-2.5 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
                  {productFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {productFormLoading ? 'Saving...' : editingProduct ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" onClick={resetProductForm}
                  className="px-6 py-2.5 border border-library-200 text-ink-600 rounded-xl font-semibold hover:bg-library-50 transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== ADD/EDIT USER FORM (MODAL) ========== */}
      {showUserForm && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={resetUserForm}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-library-200">
              <h3 className="text-lg font-heading font-bold text-ink-800 flex items-center gap-2">
                {editingUser ? <Pencil className="w-5 h-5 text-library-500" /> : <UserPlus className="w-5 h-5 text-library-500" />}
                {editingUser ? 'Edit User Role' : 'Add New User'}
              </h3>
              <button onClick={resetUserForm} className="text-ink-400 hover:text-ink-600"><X className="w-5 h-5" /></button>
            </div>

            {userFormError && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{userFormError}</p>
              </div>
            )}

            <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">Name <span className="text-red-400">*</span></label>
                    <input type="text" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">Email <span className="text-red-400">*</span></label>
                    <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">Password <span className="text-red-400">*</span></label>
                    <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none text-sm" required minLength={6} />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Role</label>
                <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none text-sm">
                  <option value="client">Client (Reader)</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
                {editingUser && <p className="text-xs text-ink-400 mt-1">Only role can be changed for existing users</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={userFormLoading}
                  className="px-6 py-2.5 bg-ink-700 text-white rounded-xl font-semibold hover:bg-ink-800 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
                  {userFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {userFormLoading ? 'Saving...' : editingUser ? 'Update Role' : 'Create User'}
                </button>
                <button type="button" onClick={resetUserForm}
                  className="px-6 py-2.5 border border-library-200 text-ink-600 rounded-xl font-semibold hover:bg-library-50 transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ OVERVIEW TAB ============ */}
      {tab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {isAdmin && stats && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Products', value: stats.totalProducts, icon: BookOpen, color: 'from-blue-400 to-blue-600' },
                  { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'from-emerald-400 to-emerald-600' },
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-purple-400 to-purple-600' },
                  { label: 'Revenue', value: `$${stats.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'from-amber-400 to-amber-600' },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-white rounded-xl border border-library-200 p-5 card-hover">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-bold text-ink-800">{s.value}</p>
                      <p className="text-sm text-ink-500">{s.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.length > 0 && (
                  <div className="bg-white rounded-xl border border-library-200 p-6">
                    <h3 className="font-heading font-bold text-ink-800 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-library-500" />
                      Recent Users
                    </h3>
                    <div className="space-y-3">
                      {users.slice(0, 5).map(u => (
                        <div key={u._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-library-200 to-library-300 flex items-center justify-center text-xs font-bold text-library-700">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-ink-800">{u.name}</p>
                              <p className="text-xs text-ink-500">{u.email}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {orders.length > 0 && (
                  <div className="bg-white rounded-xl border border-library-200 p-6">
                    <h3 className="font-heading font-bold text-ink-800 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-library-500" />
                      Recent Orders
                    </h3>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(o => (
                        <div key={o._id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-ink-800 font-mono">#{o._id.slice(-8)}</p>
                            <p className="text-xs text-ink-500">{o.user?.name || 'N/A'} &middot; ${o.totalPrice?.toFixed(2)}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(o.status)}`}>{o.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {isSeller && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'My Products', value: products.length, icon: BookOpen, color: 'from-blue-400 to-blue-600' },
                { label: 'Orders Received', value: orders.length, icon: ShoppingBag, color: 'from-emerald-400 to-emerald-600' },
                { label: 'Earnings', value: `$${orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.totalPrice || 0), 0).toFixed(2)}`, icon: DollarSign, color: 'from-amber-400 to-amber-600' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-xl border border-library-200 p-5 card-hover">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-ink-800">{s.value}</p>
                    <p className="text-sm text-ink-500">{s.label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============ PRODUCTS TAB ============ */}
      {tab === 'products' && (
        <div className="bg-white rounded-xl border border-library-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-library-50 text-left">
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Title</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Author</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Price</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Stock</th>
                  {isAdmin && <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Seller</th>}
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="py-16 text-center">
                      <BookMarked className="w-10 h-10 text-library-300 mx-auto mb-3" />
                      <p className="text-ink-500 font-medium">No products yet</p>
                      <p className="text-ink-400 text-xs mt-1">Click "Add New Book" to get started</p>
                    </td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p._id} className="border-b border-library-100 hover:bg-library-50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-ink-800">{p.title}</td>
                      <td className="py-3.5 px-4 text-ink-500">{p.author || '-'}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs bg-library-100 text-library-700 px-2.5 py-1 rounded-full font-medium">{p.category}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-ink-800">${p.price}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stockBadge(p.stock)}`}>
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      {isAdmin && <td className="py-3.5 px-4 text-ink-500 text-xs">{p.seller?.name || 'N/A'}</td>}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditProduct(p)}
                            className="p-2 text-ink-400 hover:text-library-500 hover:bg-library-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ ORDERS TAB ============ */}
      {tab === 'orders' && (
        <div className="bg-white rounded-xl border border-library-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-library-50 text-left">
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Order ID</th>
                  {isAdmin && <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Customer</th>}
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Items</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Total</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="py-16 text-center">
                      <Package className="w-10 h-10 text-library-300 mx-auto mb-3" />
                      <p className="text-ink-500 font-medium">No orders yet</p>
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} className="border-b border-library-100 hover:bg-library-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-ink-500 font-medium">#{order._id.slice(-8)}</td>
                      {isAdmin && <td className="py-3.5 px-4 text-ink-800 font-medium">{order.user?.name || 'N/A'}</td>}
                      <td className="py-3.5 px-4 text-ink-600">{order.products?.length || 0}</td>
                      <td className="py-3.5 px-4 font-semibold text-ink-800">${order.totalPrice?.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-ink-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {order.status === 'pending' && (
                            <>
                              <button onClick={() => handleOrderAction(order._id, 'completed')}
                                className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-lg font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                <Check className="w-3 h-3" /> Complete
                              </button>
                              <button onClick={() => handleOrderAction(order._id, 'cancelled')}
                                className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-1">
                                <X className="w-3 h-3" /> Cancel
                              </button>
                            </>
                          )}
                          {order.status !== 'pending' && <span className="text-xs text-ink-300">&mdash;</span>}
                          {isAdmin && (
                            <button onClick={() => handleDeleteOrder(order._id)}
                              className="text-xs bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded-lg font-medium hover:bg-rose-100 transition-colors flex items-center gap-1">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ USERS TAB (ADMIN ONLY) ============ */}
      {tab === 'users' && isAdmin && (
        <div className="bg-white rounded-xl border border-library-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-library-50 text-left">
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Email</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Joined</th>
                  <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Users className="w-10 h-10 text-library-300 mx-auto mb-3" />
                      <p className="text-ink-500 font-medium">No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u._id} className="border-b border-library-100 hover:bg-library-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-library-200 to-library-300 flex items-center justify-center text-xs font-bold text-library-700">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-ink-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-500">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                      </td>
                      <td className="py-3.5 px-4 text-ink-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => openEditUser(u)}
                            className="p-2 text-ink-400 hover:text-library-500 hover:bg-library-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {u.role !== 'admin' && (
                            <button type="button" onClick={() => handleDeleteUser(u._id)}
                              className="p-2 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ CATEGORIES TAB (ADMIN ONLY) ============ */}
      {tab === 'categories' && isAdmin && (
        <div className="space-y-6 animate-fade-in">
          {/* Add/Edit Category Form */}
          <div className="bg-white rounded-xl border border-library-200 p-6">
            <h3 className="font-heading font-bold text-ink-800 mb-4 flex items-center gap-2">
              {editingCategory ? <Pencil className="w-5 h-5 text-library-500" /> : <Plus className="w-5 h-5 text-library-500" />}
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            {catError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{catError}</p>
              </div>
            )}
            <form onSubmit={handleCategorySubmit} className="flex gap-3">
              <input
                type="text"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-4 py-2.5 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none text-sm"
                required
              />
              <button type="submit" disabled={catLoading || !categoryName.trim()}
                className="px-5 py-2.5 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
                {catLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCategory ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {catLoading ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
              </button>
              {editingCategory && (
                <button type="button" onClick={resetCategoryForm}
                  className="px-4 py-2.5 border border-library-200 text-ink-600 rounded-xl font-semibold hover:bg-library-50 transition-colors text-sm">
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-xl border border-library-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-library-50 text-left">
                    <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Name</th>
                    <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider">Created</th>
                    <th className="py-3.5 px-4 text-ink-500 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-16 text-center">
                        <Tags className="w-10 h-10 text-library-300 mx-auto mb-3" />
                        <p className="text-ink-500 font-medium">No categories yet</p>
                        <p className="text-ink-400 text-xs mt-1">Add one above to get started</p>
                      </td>
                    </tr>
                  ) : (
                    categories.map(c => (
                      <tr key={c._id} className="border-b border-library-100 hover:bg-library-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <Tags className="w-4 h-4 text-library-400" />
                            <span className="font-medium text-ink-800">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-ink-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditCategory(c)}
                              className="p-2 text-ink-400 hover:text-library-500 hover:bg-library-50 rounded-lg transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteCategory(c._id)}
                              className="p-2 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;