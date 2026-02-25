'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (shoe) => {
    setCart(prevCart => {
      // Check if shoe already in cart
      const existing = prevCart.find(item => item.id === shoe.id);
      
      if (existing) {
        // Increase quantity
        return prevCart.map(item =>
          item.id === shoe.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...shoe, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (shoeId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== shoeId));
  };

  const updateQuantity = (shoeId, quantity) => {
    if (quantity === 0) {
      removeFromCart(shoeId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === shoeId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}