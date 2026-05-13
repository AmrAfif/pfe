import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart, user } = useAuth();

  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
      alert('Added to cart!');
    } else {
      alert('Please login to add to cart');
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h3 className="text-xl font-bold mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-2">${product.price}</p>
      <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
      <div className="flex space-x-2">
        <Link
          to={`/product/${product._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Details
        </Link>
        <button
          onClick={handleAddToCart}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;