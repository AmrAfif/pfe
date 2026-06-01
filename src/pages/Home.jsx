import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import {
  BookOpen, BookMarked, TrendingUp, Users, Library, Sparkles,
  ArrowRight, Search, ChevronRight, Star, BookA, Globe, ShieldCheck,
  Headphones, Monitor, Loader2
} from 'lucide-react';

const categories = [
  { name: 'Fiction', icon: BookA, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50 text-blue-600' },
  { name: 'Non-Fiction', icon: BookOpen, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50 text-emerald-600' },
  { name: 'Technology', icon: Monitor, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50 text-purple-600' },
  { name: 'Science', icon: TrendingUp, color: 'from-cyan-400 to-cyan-600', bg: 'bg-cyan-50 text-cyan-600' },
  { name: 'History', icon: Library, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-50 text-amber-600' },
  { name: 'Audio Books', icon: Headphones, color: 'from-rose-400 to-rose-600', bg: 'bg-rose-50 text-rose-600' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const catMatch = selectedCategory
      ? p.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    const searchMatch = searchQuery
      ? p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return catMatch && searchMatch;
  });

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-library-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(176,140,80,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(176,140,80,0.1),transparent_50%)]" />
          <div className="absolute top-10 left-10 w-72 h-72 border border-library-500/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-library-500/10 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-library-200 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-library-300" />
                Discover thousands of digital books & audiobooks
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6">
                Your Digital
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-library-300 to-amber-300">Library Awaits</span>
              </h1>

              <p className="text-lg md:text-xl text-library-200/80 mb-8 leading-relaxed max-w-lg">
                Buy, sell, and explore a vast collection of e-books, audiobooks, and digital courses. 
                Join our community of passionate readers and creators.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-library-500 to-library-600 text-white rounded-xl font-semibold hover:from-library-600 hover:to-library-700 transition-all duration-300 shadow-lg shadow-library-500/25"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse Books
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
                >
                  <Star className="w-5 h-5" />
                  Get Started Free
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-library-300 to-library-500 border-2 border-ink-800 flex items-center justify-center text-[10px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-library-300 text-sm">
                  <span className="text-white font-semibold">5,000+</span> happy readers
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-br from-library-400/20 to-library-600/20 rounded-2xl border border-library-500/20 backdrop-blur-sm p-8 flex flex-col items-center justify-center">
                  <BookOpen className="w-24 h-24 text-library-400/40 mb-4" />
                  <p className="text-library-300/60 text-center text-sm">Open a book,<br />open a world</p>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/20 rounded-2xl border border-amber-400/30 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-library-500/20 rounded-2xl border border-library-500/30 backdrop-blur-sm flex items-center justify-center">
                  <BookMarked className="w-7 h-7 text-library-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="bg-white border-b border-library-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Digital Books', value: '10,000+', icon: BookOpen },
              { label: 'Active Readers', value: '5,000+', icon: Users },
              { label: 'Published Authors', value: '500+', icon: BookMarked },
              { label: 'Categories', value: '50+', icon: Library },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="w-12 h-12 rounded-xl bg-library-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-library-100 transition-colors">
                    <Icon className="w-6 h-6 text-library-500" />
                  </div>
                  <p className="text-2xl md:text-3xl font-heading font-bold text-ink-800">{stat.value}</p>
                  <p className="text-ink-500 text-sm mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SEARCH BAR ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm text-ink-800 placeholder-ink-400 shadow-sm"
          />
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink-800">Browse by Category</h2>
            <p className="text-ink-500 text-sm mt-1">Find your next great read</p>
          </div>
          <Link to="/products" className="text-sm text-library-500 hover:text-library-600 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                className={`group relative overflow-hidden rounded-xl p-5 text-center transition-all duration-300 card-hover ${
                  selectedCategory === cat.name
                    ? 'ring-2 ring-library-500 shadow-lg shadow-library-500/10 bg-white'
                    : 'bg-white border border-library-200 hover:border-library-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-ink-700">{cat.name}</span>
                {selectedCategory === cat.name && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-library-500" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4" id="featured">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink-800">
              {selectedCategory || 'All Books'}
            </h2>
            <p className="text-ink-500 text-sm mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'book' : 'books'} available
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-sm text-ink-500 hover:text-ink-700 font-medium"
              >
                Clear filter
              </button>
            )}
            <Link to="/products" className="text-sm bg-library-50 text-library-600 hover:bg-library-100 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              All Books
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-library-500 animate-spin" />
              <p className="text-ink-500 text-sm">Loading books...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-library-200">
            <BookMarked className="w-16 h-16 text-library-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-ink-700 mb-2">No books found</h3>
            <p className="text-ink-500 text-sm">
              {searchQuery ? 'Try a different search term' : 'Try selecting a different category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink-800 mb-4">Why Readers Love LibraShare</h2>
          <p className="text-ink-500 max-w-xl mx-auto">
            Everything you need for the perfect digital reading experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: 'Vast Collection', desc: 'Thousands of digital books across every genre you can imagine.', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
            { icon: Globe, title: 'Read Anywhere', desc: 'Access your library on any device, anytime, anywhere in the world.', color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' },
            { icon: ShieldCheck, title: 'Secure & Fair', desc: 'Protected transactions with direct support for authors and publishers.', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group bg-white border border-library-200 rounded-2xl p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" style={{ color: f.color.split(' ')[1] }} />
                </div>
                <h3 className="font-heading font-bold text-ink-800 text-lg mb-2">{f.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative bg-gradient-to-r from-library-600 via-library-700 to-ink-800 overflow-hidden">
        <div className="absolute inset-0 book-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Library className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Ready to Start Your Digital Library?
            </h2>
            <p className="text-library-200 text-lg mb-8 leading-relaxed">
              Join thousands of readers and start building your collection today. 
              First book free for new members.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-library-700 rounded-xl font-semibold hover:bg-library-50 transition-colors shadow-lg"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                <BookOpen className="w-4 h-4" />
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;