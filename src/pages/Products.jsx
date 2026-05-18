import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import {
  BookOpen, BookMarked, Search, SlidersHorizontal, Grid3X3, List,
  ChevronDown, Loader2, X, Filter, ArrowUpDown, LayoutGrid
} from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('/products'),
          axios.get('/categories'),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let filtered = products.filter(p => {
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

  switch (sortBy) {
    case 'newest':
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'oldest':
      filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'price-asc':
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered = [...filtered].sort((a, b) => a.title?.localeCompare(b.title));
      break;
    case 'name-desc':
      filtered = [...filtered].sort((a, b) => b.title?.localeCompare(a.title));
      break;
    default:
      break;
  }

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== 'newest';

  return (
    <div>
      {/* ===== PAGE HEADER ===== */}
      <section className="bg-gradient-to-r from-ink-800 to-library-700 relative overflow-hidden">
        <div className="absolute inset-0 book-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <nav className="flex items-center gap-2 text-sm text-library-300 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-white font-medium">Books</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Browse Books</h1>
              <p className="text-library-200 text-sm mt-1">
                {filtered.length} {filtered.length === 1 ? 'book' : 'books'} found
                {selectedCategory && <> in <span className="font-semibold">{selectedCategory}</span></>}
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-sm font-medium backdrop-blur-sm"
            >
              <BookMarked className="w-4 h-4" />
              Join to Buy
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTERS BAR ===== */}
      <section className="bg-white border-b border-library-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-library-50 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none transition-all text-sm text-ink-800 placeholder-ink-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {/* Category filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-8 bg-library-50 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none text-sm text-ink-700 cursor-pointer min-w-[140px]"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-8 bg-library-50 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none text-sm text-ink-700 cursor-pointer min-w-[130px]"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400 pointer-events-none hidden sm:block" />
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="hidden sm:flex bg-library-50 border border-library-200 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-ink-800' : 'text-ink-400 hover:text-ink-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-ink-800' : 'text-ink-400 hover:text-ink-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter toggle mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden p-2.5 bg-library-50 border border-library-200 rounded-xl text-ink-500 hover:text-ink-700"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-library-100">
              <span className="text-xs text-ink-400">Active filters:</span>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="inline-flex items-center gap-1 px-2.5 py-1 bg-library-50 text-library-600 text-xs rounded-lg font-medium hover:bg-library-100">
                  "{searchQuery}" <X className="w-3 h-3" />
                </button>
              )}
              {selectedCategory && (
                <button onClick={() => setSelectedCategory('')} className="inline-flex items-center gap-1 px-2.5 py-1 bg-library-50 text-library-600 text-xs rounded-lg font-medium hover:bg-library-100">
                  {selectedCategory} <X className="w-3 h-3" />
                </button>
              )}
              {sortBy !== 'newest' && (
                <button onClick={() => setSortBy('newest')} className="inline-flex items-center gap-1 px-2.5 py-1 bg-library-50 text-library-600 text-xs rounded-lg font-medium hover:bg-library-100">
                  {sortOptions.find(o => o.value === sortBy)?.label} <X className="w-3 h-3" />
                </button>
              )}
              <button onClick={clearFilters} className="text-xs text-ink-400 hover:text-red-500 ml-1 font-medium">Clear all</button>
            </div>
          )}
        </div>
      </section>

      {/* ===== PRODUCTS GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-library-500 animate-spin" />
              <p className="text-ink-500 text-sm">Loading books...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-library-200">
            <div className="w-20 h-20 bg-library-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookMarked className="w-10 h-10 text-library-300" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-ink-700 mb-2">No books found</h3>
            <p className="text-ink-500 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term or browse categories.`
                : 'No books available in this category yet. Check back soon!'}
            </p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors text-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-ink-500">
                Showing <span className="font-semibold text-ink-700">{filtered.length}</span> of{' '}
                <span className="font-semibold text-ink-700">{products.length}</span> books
              </p>
              <p className="text-xs text-ink-400">
                Page 1 of 1
              </p>
            </div>

            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Products;