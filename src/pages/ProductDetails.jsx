import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart, user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-library-200 border-t-library-500 rounded-full animate-spin" />
          <p className="text-ink-500">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <svg className="w-20 h-20 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h2 className="text-2xl font-heading font-bold text-ink-800 mb-2">Book Not Found</h2>
        <p className="text-ink-500 mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="px-6 py-3 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-ink-500 mb-8">
        <Link to="/" className="hover:text-library-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/" className="hover:text-library-500 transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-ink-800 font-medium truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[3/4] bg-gradient-to-br from-library-100 to-library-200 rounded-2xl overflow-hidden">
          {product.image ? (
            <img
              src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-32 h-32 text-library-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-library-500 mb-2">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink-800 mb-2">{product.title}</h1>
          {product.author && (
            <p className="text-lg text-ink-500 mb-6">by <span className="font-semibold text-ink-700">{product.author}</span></p>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-library-600">${product.price}</span>
            {product.stock > 0 && (
              <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">In Stock</span>
            )}
            {product.stock === 0 && (
              <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full font-medium">Out of Stock</span>
            )}
          </div>

          {product.pages > 0 && (
            <div className="flex items-center gap-6 mb-6 text-sm text-ink-500">
              <span>{product.pages} pages</span>
            </div>
          )}

          <div className="border-t border-library-200 pt-6 mb-6">
            <h3 className="font-heading font-bold text-ink-800 mb-3">Description</h3>
            <p className="text-ink-600 leading-relaxed">{product.description}</p>
          </div>

          {product.fileUrl && (
            <div className="bg-library-50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-library-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-sm text-ink-600">Digital file included</span>
            </div>
          )}

          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-library-500 text-white hover:bg-library-600'
              }`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            {!user && (
              <Link
                to="/login"
                className="flex-1 py-3 bg-ink-100 text-ink-700 rounded-xl font-semibold hover:bg-ink-200 transition-colors text-center"
              >
                Sign in to Purchase
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;