// ================================================================
// Shreedha Vastra — Product Details Page
// ================================================================
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHeart, FiTruck, FiRotateCcw, FiShield } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';
import ImageGallery from '../components/product/ImageGallery';
import { SizeSelector, ColorSelector, QuantitySelector } from '../components/product/ProductOptions';
import PriceTag from '../components/common/PriceTag';
import StarRating from '../components/common/StarRating';
import ProductGrid from '../components/product/ProductGrid';
import Reviews from '../components/product/Reviews';
import Loader from '../components/common/Loader';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const TABS = ['Description', 'Specifications', 'Fabric & Care', 'Delivery & Returns'];

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const isWishlisted = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { product } = await productService.getProductBySlug(slug);
        setProduct(product);
        setSelectedColor(product.colors?.[0]?.name || '');
        const { products } = await productService.getSimilarProducts(slug);
        setSimilar(products);
      } catch {
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
   
    addToCart(product, selectedSize, selectedColor, quantity);
  };
    
  

  const handleWishlist = () => {
    toggleWishlist(product._id);
  };
 
return(  
    <div className="container-custom py-8">
      <Helmet
        title={`${product.name} | Shreedha Vastra`}
        description={product.shortDescription || product.description?.slice(0, 150)}
      />

      <div className="grid lg:grid-cols-2 gap-10">
        <ImageGallery images={product.colors?.find((c) => c.name === selectedColor)?.images?.length ? product.colors.find((c) => c.name === selectedColor).images : product.images} />

        <div>
          <p className="text-gold text-sm font-medium mb-1">{product.category?.name}</p>
          <h1 className="font-serif text-3xl mb-2">{product.name}</h1>
          <StarRating rating={product.ratingsAverage} showCount count={product.numReviews} />

          <div className="my-6">
            <PriceTag price={product.price} discountPrice={product.discountPrice} size="lg" />
          </div>

          <p className="text-charcoal/70 dark:text-ivory/70 mb-6">{product.shortDescription}</p>

          <div className="space-y-6 mb-6">
            {product.colors?.length > 0 && (
              <ColorSelector colors={product.colors} selectedColor={selectedColor} onSelect={setSelectedColor} />
            )}
            <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center shrink-0"
              aria-label="Toggle wishlist"
            >
              <FiHeart className={isWishlisted ? 'fill-gold text-gold' : 'text-gold'} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 text-xs text-center text-charcoal/60 dark:text-ivory/60">
            <div className="flex flex-col items-center gap-1">
              <FiTruck size={20} className="text-gold" /> Fast Delivery
            </div>
            <div className="flex flex-col items-center gap-1">
              <FiRotateCcw size={20} className="text-gold" /> 7-Day Returns
            </div>
            <div className="flex flex-col items-center gap-1">
              <FiShield size={20} className="text-gold" /> Secure Payment
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specs / Fabric & Care / Delivery */}
      <div className="mt-16">
        <div className="flex gap-6 border-b border-beige overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`pb-3 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${
                activeTab === i ? 'border-gold text-gold' : 'border-transparent text-charcoal/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6 text-sm leading-relaxed text-charcoal/80 dark:text-ivory/80">
          {activeTab === 0 && <p>{product.description}</p>}
          {activeTab === 1 && (
            <ul className="space-y-2">
              {product.specifications?.map((s) => (
                <li key={s.key} className="flex gap-2">
                  <span className="font-medium w-32 shrink-0">{s.key}:</span> {s.value}
                </li>
              ))}
              {(!product.specifications || product.specifications.length === 0) && <p>No additional specifications provided.</p>}
            </ul>
          )}
          {activeTab === 2 && (
            <div className="space-y-3">
              <p><span className="font-medium">Fabric: </span>{product.fabric}</p>
              <p><span className="font-medium">Care Instructions: </span>{product.careInstructions}</p>
            </div>
          )}
          {activeTab === 3 && (
            <div className="space-y-3">
              <p>{product.deliveryInfo}</p>
              <p>{product.returnPolicy}</p>
            </div>
          )}
        </div>
      </div>

      <Reviews productId={product._id} />

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="section-heading !text-left mb-8">You May Also Like</h2>
          <ProductGrid products={similar} />
        </div>
      )}
    </div>
);
};

export default ProductDetails;
