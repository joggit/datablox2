"use client";

import React from "react";
import { useCart } from "../../../lib/cart"; // Import the cart context
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase"; // Firestore instance
import { doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <img
          className="h-16 w-16 rounded-md object-cover"
          src={item.images?.[0] || "https://via.placeholder.com/150"}
          alt={item.name}
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
          <p className="text-gray-600 text-sm">Price: ZAR {item.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400"
        >
          -
        </button>
        <span className="text-lg font-semibold">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-white active:bg-primary-light"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 transition"
      >
        Remove
      </button>
    </div>
  );
};

const ShoppingCart = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = React.useState(null);

  // Detect the authenticated user
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please sign in to place an order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const orderId = `order_${Date.now()}`;
      const orderData = {
        items: cart,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      };

      // Store the order in Firestore
      await setDoc(doc(db, "orders", orderId), orderData);

      // Clear the cart after placing the order
      clearCart();

      // Redirect to a confirmation page or home page
      router.push(`/checkout/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>ZAR {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>ZAR {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-primary hover:bg-primary-light text-white py-2 rounded-lg"
          >
            Place Order
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
