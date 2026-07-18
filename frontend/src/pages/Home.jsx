// ================================================================
// Shreedha Vastra — Home Page
// ================================================================
import { useEffect, useState } from 'react';
import { Helmet } from '../components/common/Helmet';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import Testimonials from '../components/home/Testimonials';
import InstagramGallery from '../components/home/InstagramGallery';
import ProductGrid from '../components/product/ProductGrid';
import { Link } from 'react-router-dom';
import bannerService from '../services/bannerService';
import categoryService from '../services/categoryService';
import productService from '../services/productService';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [bannerRes, categoryRes, featuredRes, bestSellerRes, newArrivalRes] = await Promise.all([
          bannerService.getActiveBanners('hero'),
          categoryService.getCategories(),
          productService.getFeatured(),
          productService.getBestSellers(),
          productService.getNewArrivals(),
        ]);
        setBanners(bannerRes.banners);
        setCategories(categoryRes.categories);
        setFeatured(featuredRes.products);
        setBestSellers(bestSellerRes.products);
        setNewArrivals(newArrivalRes.products);
      } catch (err) {
        // Errors are already toasted globally; homepage still renders with whatever loaded
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <>
      <Helmet
        title="Shreedha Vastra | Premium Indian Ethnic Wear"
        description="Shop premium, royal, elegant Indian ethnic wear — suit sets, kurta sets, festive and wedding collections."
      />

      <HeroBanner banners={banners} />

      <CategoryGrid categories={categories} />

      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
          <h2 className="section-heading !text-left">Featured Collections</h2>
          <Link to="/shop" className="text-gold font-medium hover:underline hidden sm:block">
            View All →
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} />
      </section>

      {/* <section className="bg-beige/30 py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading !text-left">Best Sellers</h2>
            <Link to="/shop?collection=Best Sellers" className="text-gold font-medium hover:underline hidden sm:block">
              View All →
            </Link>
          </div>
          <ProductGrid products={bestSellers} loading={loading} />
        </div>
      </section> */}

      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
          <h2 className="section-heading !text-left">New Arrivals</h2>
          <Link to="/shop?collection=New Arrivals" className="text-gold font-medium hover:underline hidden sm:block">
            View All →
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loading} />
      </section>

      <Testimonials />
      <InstagramGallery />
    </>
  );
};

export default Home;
