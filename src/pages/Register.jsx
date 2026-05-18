import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { value: 'client', label: 'Reader', icon: '📖', desc: 'Browse and purchase digital books' },
  { value: 'seller', label: 'Seller', icon: '📚', desc: 'Publish and sell your books' },
];

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-library-200 overflow-hidden">
          <div className="bg-gradient-to-r from-library-500 to-library-600 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">Join LibraShare</h2>
            <p className="text-library-200 text-sm mt-1">Create your account</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-ink-800 placeholder-ink-400"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-ink-800 placeholder-ink-400"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-ink-800 placeholder-ink-400"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-3">I want to</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.value })}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.role === r.value
                          ? 'border-library-500 bg-library-50'
                          : 'border-library-200 hover:border-library-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{r.icon}</span>
                      <span className="text-sm font-semibold text-ink-800 block">{r.label}</span>
                      <span className="text-xs text-ink-500">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-500">
              Already have an account?{' '}
              <Link to="/login" className="text-library-500 hover:text-library-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;