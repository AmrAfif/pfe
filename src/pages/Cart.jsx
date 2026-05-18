import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, user } = useAuth();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
      }));

      await axios.post('/orders', { orderItems, totalPrice });
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <svg className="w-24 h-24 text-library-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h1 className="text-3xl font-heading font-bold text-ink-800 mb-2">Your Cart is Empty</h1>
          <p className="text-ink-500 mb-8">Looks like you haven't added any books yet.</p>
          <Link
            to="/"
            className="inline-flex px-6 py-3 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink-800">Shopping Cart</h1>
          <p className="text-ink-500 text-sm mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="bg-white rounded-xl border border-library-200 p-4 flex gap-4 card-hover">
              <div className="w-20 h-28 bg-gradient-to-br from-library-100 to-library-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-library-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                )}
              </div>
              <div className="flex-grow">
                <Link to={`/product/${item._id}`} className="font-heading font-bold text-ink-800 hover:text-library-600 transition-colors">
                  {item.title}
                </Link>
                {item.author && <p className="text-xs text-ink-500">by {item.author}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-library-200 flex items-center justify-center text-ink-600 hover:bg-library-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-medium text-ink-800 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-library-200 flex items-center justify-center text-ink-600 hover:bg-library-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-library-600">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-ink-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-library-200 p-6 sticky top-24">
            <h3 className="font-heading font-bold text-ink-800 text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-ink-600">
                  <span className="truncate max-w-[180px]">{item.title} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-library-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-ink-800">Total</span>
                <span className="text-2xl font-bold text-library-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-6 py-3 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/"
              className="block text-center mt-3 text-sm text-ink-500 hover:text-library-500 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;