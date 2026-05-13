import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Cart = () => {
  const { cart, removeFromCart, clearCart, user } = useAuth();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
      }));

      await axios.post('/orders', {
        orderItems,
        totalPrice,
      });

      alert('Order placed successfully!');
      clearCart();
    } catch (error) {
      alert('Error placing order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item._id} className="flex justify-between items-center border p-4 rounded">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
        <button
          onClick={handleCheckout}
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;