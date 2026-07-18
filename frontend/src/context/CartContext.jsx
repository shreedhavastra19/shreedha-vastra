// ================================================================
// Shreedha Vastra — Cart Context
// ================================================================
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import userService from '../services/userService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();
const GUEST_CART_KEY = 'guestCart';

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasMergedRef = useRef(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(readGuestCart());
      return;
    }
    setLoading(true);
    try {
      const { cart } = await userService.getCart();
      setCart(cart || []);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const sync = async () => {
      if (isAuthenticated) {
        const guestItems = readGuestCart();
        if (guestItems.length > 0 && !hasMergedRef.current) {
          hasMergedRef.current = true;
          setLoading(true);
          for (const item of guestItems) {
            try {
              await userService.addToCart({
                productId: item.product,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
              });
            } catch {
              // e.g. item went out of stock between add and login — skip it
            }
          }
          localStorage.removeItem(GUEST_CART_KEY);
        }
        await refreshCart();
      } else {
        hasMergedRef.current = false;
        setCart(readGuestCart());
      }
    };
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addToCart = async (product, size, color, quantity = 1) => {
    if (isAuthenticated) {
      const { cart } = await userService.addToCart({ productId: product._id, size, color, quantity });
      setCart(cart || []);
    } else {
      const guestId = `${product._id}-${size}-${color || ''}`;
      const current = readGuestCart();
      const existing = current.find((i) => i._id === guestId);
      const next = existing
        ? current.map((i) => (i._id === guestId ? { ...i, quantity: i.quantity + quantity } : i))
        : [
            ...current,
            {
              _id: guestId,
              product: product._id,
              name: product.name,
              image: product.images?.[0]?.url || '',
              size,
              color,
              price: product.discountPrice || product.price,
              quantity,
            },
          ];
      writeGuestCart(next);
      setCart(next);
    }
    toast.success('Added to cart');
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      const { cart } = await userService.updateCartItem(itemId, quantity);
      setCart(cart || []);
    } else {
      const next = readGuestCart().map((i) => (i._id === itemId ? { ...i, quantity } : i));
      writeGuestCart(next);
      setCart(next);
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      const { cart } = await userService.removeFromCart(itemId);
      setCart(cart || []);
    } else {
      const next = readGuestCart().filter((i) => i._id !== itemId);
      writeGuestCart(next);
      setCart(next);
    }
    toast.success('Removed from cart');
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await userService.clearCart();
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
    setCart([]);
  };

  const cartTotal = (cart || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;