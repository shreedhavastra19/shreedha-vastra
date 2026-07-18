// ================================================================
// Shreedha Vastra — Wishlist Context
// ================================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const { wishlist } = await userService.getWishlist();
      setWishlist(wishlist);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId) => wishlist.some((p) => p._id === productId);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to use your wishlist');
      return;
    }
    if (isInWishlist(productId)) {
      const { wishlist } = await userService.removeFromWishlist(productId);
      setWishlist(wishlist);
      toast.success('Removed from wishlist');
    } else {
      const { wishlist } = await userService.addToWishlist(productId);
      setWishlist(wishlist);
      toast.success('Added to wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, isInWishlist, toggleWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;
