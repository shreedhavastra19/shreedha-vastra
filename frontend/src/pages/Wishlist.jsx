// ================================================================
// Shreedha Vastra — Wishlist Page
// ================================================================
import { FiHeart } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';
import EmptyState from '../components/common/EmptyState';
import ProductGrid from '../components/product/ProductGrid';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlist: items, loading } = useWishlist();

  if (!loading && items.length === 0) {
    return (
      <EmptyState
        icon={FiHeart}
        title="Your wishlist is empty"
        message="Save your favorite pieces here so you never lose track of them."
        ctaText="Explore Collections"
        ctaLink="/shop"
      />
    );
  }

  return (
    <div className="container-custom py-10">
      <Helmet title="Your Wishlist | Shreedha Vastra" />
      <h1 className="font-serif text-3xl mb-8">My Wishlist</h1>
      <ProductGrid products={items} loading={loading} />
    </div>
  );
};

export default Wishlist;
