import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart, user } = useAuth();

  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
    }
  };

  const truncate = (str, n) => str?.length > n ? str.slice(0, n) + '...' : str;

  return (
    <div className="bg-white rounded-xl border border-library-200 overflow-hidden card-hover group">
      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-[4/3] bg-gradient-to-br from-library-100 to-library-200 relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                e.target.parentElement.innerHTML = `<svg class="w-16 h-16 text-library-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-library-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          )}
          <span className="absolute top-3 left-3 bg-white/90 text-ink-700 text-xs px-2 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="p-4">
        {product.author && (
          <p className="text-library-500 text-xs font-medium mb-1">by {product.author}</p>
        )}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-heading font-bold text-ink-800 text-lg mb-1 group-hover:text-library-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-ink-500 text-sm mb-3 line-clamp-2">{truncate(product.description, 80)}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-library-600">${product.price}</span>
          <button
            onClick={handleAddToCart}
            className="px-3 py-2 bg-library-500 text-white rounded-lg text-sm font-medium hover:bg-library-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;