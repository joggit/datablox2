"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Create the Cart Context
const CartContext = createContext();

// Custom Hook for accessing cart context
export const useCart = () => useContext(CartContext);

// CartProvider Component
export const CartProvider = ({ children }) => {
  // Use a state to track if the component has mounted
  const [isMounted, setIsMounted] = useState(false);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Set the component as mounted
    setIsMounted(true);

    // Check if window is defined to access localStorage
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Only render children if the component has mounted
  if (!isMounted) {
    return null; // or a loading indicator
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartCount,
        clearCart, // Add clearCart here
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
