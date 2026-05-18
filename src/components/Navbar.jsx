import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            <svg className="w-8 h-8 text-library-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-xl font-heading font-bold">LibraShare</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-ink-600 hover:text-ink-900 transition-colors font-medium">Home</Link>
            <Link to="/about" className="text-ink-600 hover:text-ink-900 transition-colors font-medium">About</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative text-ink-600 hover:text-ink-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-library-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                  )}
                </Link>

                <div className="flex items-center gap-2 border-l border-library-200 pl-4">
                  <div className="w-8 h-8 rounded-full bg-library-500 text-white flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="relative group">
                    <button className="text-ink-700 hover:text-ink-900 font-medium flex items-center gap-1">
                      {user.name}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-library-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {user.role === 'admin' && (
                          <Link to="/dashboard" className="block px-4 py-2 text-ink-700 hover:bg-library-50 hover:text-library-700">Admin Dashboard</Link>
                        )}
                        {user.role === 'seller' && (
                          <Link to="/dashboard" className="block px-4 py-2 text-ink-700 hover:bg-library-50 hover:text-library-700">Seller Dashboard</Link>
                        )}
                        {user.role === 'client' && (
                          <Link to="/my-orders" className="block px-4 py-2 text-ink-700 hover:bg-library-50 hover:text-library-700">My Orders</Link>
                        )}
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-ink-700 hover:text-ink-900 font-medium transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-library-500 text-white rounded-lg hover:bg-library-600 transition-colors font-medium">Get Started</Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-ink-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-library-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-ink-700 font-medium">Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-ink-700 font-medium">About</Link>
            {user ? (
              <>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2 text-ink-700 font-medium">Cart ({cartCount})</Link>
                {user.role === 'admin' && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-ink-700 font-medium">Admin Dashboard</Link>}
                {user.role === 'seller' && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-ink-700 font-medium">Seller Dashboard</Link>}
                {user.role === 'client' && <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block py-2 text-ink-700 font-medium">My Orders</Link>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block py-2 text-red-600 font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-ink-700 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-library-600 font-medium">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;