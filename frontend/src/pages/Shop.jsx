// ================================================================
// Shreedha Vastra — Shop Page (filters, search, sort, pagination)
// ================================================================
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/common/Pagination';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { SIZES } from '../utils/helpers';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-ratingsAverage', label: 'Top Rated' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || '-createdAt';
  const search = searchParams.get('search') || '';
  const collection = searchParams.get('collection') || '';
  const category = searchParams.get('category') || '';
  const size = searchParams.get('size') || '';
  const minPrice = searchParams.get('price[gte]') || '';
  const maxPrice = searchParams.get('price[lte]') || '';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    // Reset to page 1 whenever a filter changes — but not when the user
    // is navigating pages themselves, or pagination would never work.
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      delete params.collection; // not a real schema field — replaced below with the correct one
      if (collection) params.collections = collection; // matches Product.collections enum field on the backend
      const { products, page: p, pages, total } = await productService.getProducts(params);
      setProducts(products);
      setPagination({ page: p, pages, total });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.categories));
  }, []);

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2 text-sm">
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={category === c._id}
                onChange={() => updateParam('category', c._id)}
              />
              {c.name}
            </label>
          ))}
          {category && (
            <button onClick={() => updateParam('category', '')} className="text-gold text-xs mt-1">
              Clear category
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => updateParam('size', size === s ? '' : s)}
              className={`w-10 h-10 rounded-lg border text-sm ${
                size === s ? 'bg-gold text-ivory border-gold' : 'border-beige'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParam('price[gte]', e.target.value)}
            className="input-field py-2 text-sm"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParam('price[lte]', e.target.value)}
            className="input-field py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet title="Shop | Shreedha Vastra" description="Browse our full collection of premium Indian ethnic wear." />

      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl">
            {collection || (search && `Results for "${search}"`) || 'Shop All'}
          </h1>
          <p className="text-sm text-charcoal/50 hidden sm:block">{pagination.total} products</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-beige px-4 py-2 rounded-full text-sm"
          >
            <FiFilter size={14} /> Filters
          </button>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-field py-2 text-sm w-fit ml-auto"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block">{FilterPanel}</aside>

          <div>
            <ProductGrid products={products} loading={loading} />
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={(p) => updateParam('page', p)}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-ivory dark:bg-charcoal p-6 overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <FiX size={20} />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
