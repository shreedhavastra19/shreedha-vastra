import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import PriceTag from '../common/PriceTag';
import StarRating from '../common/StarRating';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const totalstock = product.totalstock ?? product.sizes?.reduce((sum, s) => sum + s.stock, 0) ?? 0;
  const isOutOfStock = totalstock === 0;
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  const primaryImage = product.images?.[0]?.url || '/placeholder-product.jpg';
  const secondaryImage = product.images?.[1]?.url;

  return (
    <Link to={`/product/${product.slug}`} className="card group animate-fadeIn">
      <div className="relative aspect-[3/4] overflow-hidden bg-beige/40">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-500 ${isOutOfStock ? 'opacity-50 grayscale' : ''
            } ${secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {isOutOfStock ? (
          <span className="absolute top-3 left-3 bg-charcoal text-ivory text-xs font-medium px-2 py-1 rounded-full">
            Out of Stock
          </span>
        ) : product.discountPrice && (
          <span className="absolute top-3 left-3 bg-gold text-ivory text-xs font-medium px-2 py-1 rounded-full">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </span>
        )}

        <button
          onClick={handleWishlistToggle}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
        >
          <FiHeart size={16} className={isWishlisted ? 'fill-gold text-gold' : 'text-charcoal'} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
        <div className="mt-1">
          <StarRating rating={product.ratingsAverage} showCount count={product.numReviews} size={12} />
        </div>
        <div className="mt-2">
          <PriceTag price={product.price} discountPrice={product.discountPrice} size="sm" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
