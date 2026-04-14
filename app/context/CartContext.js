'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Check real stock
  const checkStock = async (productId, selectedColor, selectedSize) => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const product = await res.json();
      if (!product || product.error) return 0;

      const variant = product.variants?.find(v => v.color === selectedColor);
      const sizeObj = variant?.sizes?.find(s => s.size === Number(selectedSize));
      return sizeObj?.stock || 0;
    } catch (err) {
      console.error('Stock check failed:', err);
      return 0;
    }
  };

  // Improved notification
  const showNotification = (message, type = 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-sm font-medium shadow-2xl z-[100] transition-all duration-300 ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  const addToCart = async (shoe) => {
    const { id, selectedColor, selectedSize } = shoe;

    const availableStock = await checkStock(id, selectedColor, selectedSize);

    if (availableStock === 0) {
      showNotification(`Sorry, this size is out of stock.`);
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      );

      const currentQtyInCart = existing ? existing.quantity : 0;
      const newQuantity = currentQtyInCart + 1;

      if (newQuantity > availableStock) {
        showNotification(`Only ${availableStock} left in stock for this size.`);
        return prevCart;
      }

      if (existing) {
        return prevCart.map(item =>
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevCart, { ...shoe, quantity: 1 }];
      }
    });
  };

  const updateQuantity = async (shoeId, selectedColor, selectedSize, quantity) => {
    if (quantity === 0) {
      removeFromCart(shoeId, selectedColor, selectedSize);
      return;
    }

    const availableStock = await checkStock(shoeId, selectedColor, selectedSize);

    if (quantity > availableStock) {
      showNotification(`Only ${availableStock} left in stock for this size.`);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === shoeId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (shoeId, selectedColor, selectedSize) => {
    setCart(prevCart => prevCart.filter(item =>
      !(item.id === shoeId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize)
    ));
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}