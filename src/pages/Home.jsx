import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'Fiction', icon: '📚', color: 'from-blue-400 to-blue-600' },
  { name: 'Non-Fiction', icon: '📖', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Technology', icon: '💻', color: 'from-purple-400 to-purple-600' },
  { name: 'Science', icon: '🔬', color: 'from-cyan-400 to-cyan-600' },
  { name: 'History', icon: '🏛️', color: 'from-amber-400 to-amber-600' },
  { name: 'Philosophy', icon: '🧠', color: 'from-rose-400 to-rose-600' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase())
    : products;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-library-700 overflow-hidden">
        <div className="absolute inset-0 book-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-library-200 px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Discover thousands of digital books
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Your Digital Library
              <span className="block text-library-300">Marketplace</span>
            </h1>
            <p className="text-lg md:text-xl text-library-200 mb-8 leading-relaxed">
              Buy, sell, and explore a vast collection of e-books, audiobooks, and digital courses. 
              Join our community of passionate readers and creators.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors shadow-lg shadow-library-500/25"
              >
                Start Reading
              </Link>
              <Link
                to="#featured"
                className="px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Explore Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-library-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Digital Books', value: '10,000+' },
              { label: 'Active Readers', value: '5,000+' },
              { label: 'Authors', value: '500+' },
              { label: 'Categories', value: '50+' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-library-600">{stat.value}</p>
                <p className="text-ink-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink-800 mb-4">Browse by Category</h2>
          <p className="text-ink-500 max-w-xl mx-auto">
            Find your next great read from our carefully curated categories
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
              className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 card-hover ${
                selectedCategory === cat.name
                  ? 'ring-2 ring-library-500 shadow-lg'
                  : 'bg-white border border-library-200'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <span className="text-sm font-medium text-ink-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" id="featured">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink-800">
              {selectedCategory || 'All Books'}
            </h2>
            <p className="text-ink-500 text-sm mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'book' : 'books'} available
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-sm text-library-500 hover:text-library-600 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-library-200 border-t-library-500 rounded-full animate-spin" />
              <p className="text-ink-500">Loading books...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-library-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 className="text-xl font-heading font-bold text-ink-700 mb-2">No books found</h3>
            <p className="text-ink-500">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-library-600 to-library-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Start Your Digital Library?
          </h2>
          <p className="text-library-200 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of readers and start building your collection today.
          </p>
          <Link
            to="/register"
            className="inline-flex px-8 py-3 bg-white text-library-700 rounded-xl font-semibold hover:bg-library-50 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;