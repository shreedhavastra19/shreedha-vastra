// ================================================================
// Shreedha Vastra — Navbar
// ================================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiMoon, FiSun, FiPackage } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { COLLECTIONS } from '../../utils/helpers';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 dark:bg-charcoal/95 backdrop-blur-sm border-b border-beige/60 dark:border-white/10">
      {/* Top announcement strip */}
      <div className="bg-gold text-ivory text-center text-xs sm:text-sm py-2 px-4">
        Free shipping on orders above ₹1999 · Use code WELCOME10 for 10% off your first order
      </div>

      <div className="container-custom flex items-center justify-between py-4 gap-4">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl sm:text-3xl font-bold text-gold-dark shrink-0">
          Shreedha Vastra
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
          {COLLECTIONS.slice(0, 5).map((c) => (
            <Link
              key={c}
              to={`/shop?collection=${encodeURIComponent(c)}`}
              className="hover:text-gold transition-colors"
            >
              {c}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs relative">
          <FiSearch className="absolute left-3 text-charcoal/40" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for suit sets, kurtas..."
            className="input-field py-2 pl-9 text-sm"
          />
        </form>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="hover:text-gold">
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <Link to="/wishlist" className="relative hover:text-gold" aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative hover:text-gold" aria-label="Cart">
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
<Link to="/orders" className="hover:text-gold" aria-label="My Orders">
<FiPackage/>
</Link>
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/profile') : '/login'}
            className="hover:text-gold"
            aria-label="Account"
          >
            <FiUser size={20} />
          </Link>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory dark:bg-charcoal border-t border-beige/60 dark:border-white/10 px-4 py-4 animate-slideUp">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="input-field text-sm"
            />
          </form>
          <nav className="flex flex-col gap-3">
            {COLLECTIONS.map((c) => (
              <Link
                key={c}
                to={`/shop?collection=${encodeURIComponent(c)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 font-medium"
              >
                {c}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
