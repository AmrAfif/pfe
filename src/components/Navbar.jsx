import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ShoppingCart, Menu, X, ChevronDown, LogOut, LayoutDashboard, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout, cart } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-library-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-ink-900 hover:text-library-600 transition-colors">
            <BookOpen className="w-7 h-7 text-library-500" />
            <span className="text-xl font-heading font-bold">LibraShare</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-ink-600 hover:text-ink-900 transition-colors font-medium text-sm">Home</Link>
            <Link to="/products" className="text-ink-600 hover:text-ink-900 transition-colors font-medium text-sm">Books</Link>
            <Link to="/about" className="text-ink-600 hover:text-ink-900 transition-colors font-medium text-sm">About</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative text-ink-600 hover:text-ink-900 transition-colors p-1">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-library-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                  )}
                </Link>

                <div className="flex items-center gap-2 border-l border-library-200 pl-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-library-400 to-library-600 text-white flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="relative group">
                    <button className="text-ink-700 hover:text-ink-900 font-medium flex items-center gap-1 text-sm">
                      {user.name}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-library-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                      <div className="py-1">
                        {(user.role === 'admin' || user.role === 'seller') && (
                          <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-library-50 hover:text-library-700 transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            {user.role === 'admin' ? 'Admin' : 'Seller'} Dashboard
                          </Link>
                        )}
                        {user.role === 'client' && (
                          <Link to="/my-orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-library-50 hover:text-library-700 transition-colors">
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-ink-700 hover:text-ink-900 font-medium transition-colors text-sm">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-library-500 text-white rounded-lg hover:bg-library-600 transition-colors font-medium text-sm">Get Started</Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-ink-700 p-1">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-library-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-ink-700 font-medium">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-ink-700 font-medium">Books</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-ink-700 font-medium">About</Link>
            {user ? (
              <>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-ink-700 font-medium">
                  <ShoppingCart className="w-4 h-4" /> Cart ({cartCount})
                </Link>
                {(user.role === 'admin' || user.role === 'seller') && (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-ink-700 font-medium">
                    <LayoutDashboard className="w-4 h-4" /> {user.role === 'admin' ? 'Admin' : 'Seller'} Dashboard
                  </Link>
                )}
                {user.role === 'client' && (
                  <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-ink-700 font-medium">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-2 py-2.5 text-sm text-red-600 font-medium">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-ink-700 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-library-600 font-medium">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;