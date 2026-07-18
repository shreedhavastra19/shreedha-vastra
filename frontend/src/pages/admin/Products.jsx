// ================================================================
// Shreedha Vastra — Admin: Product Management
// ================================================================
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { DataTable, Modal } from '../../components/admin/AdminUI';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { formatCurrency, COLLECTIONS, SIZES } from '../../utils/helpers';

const emptyForm = {
  name: '', description: '', shortDescription: '', category: '', sku: '', price: '', discountPrice: '',
  fabric: '', careInstructions: '', collections: [],
  isFeatured: true, isBestSeller: true, isNewArrival: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sizeStock, setSizeStock] = useState(SIZES.map((s) => ({ size: s, stock: 0 })));
  const [selectedCollections, setSelectedCollections] = useState([]);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: emptyForm });

  const loadProducts = async () => {
    setLoading(true);
    const res = await productService.getAdminProducts({ limit: 100 });
    setProducts(res.products);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    categoryService.getCategories().then((res) => setCategories(res.categories));
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    reset(emptyForm);
    setSizeStock(SIZES.map((s) => ({ size: s, stock: 0 })));
    setSelectedFiles([]);
    setSelectedCollections([]);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      category: product.category?._id,
      sku: product.sku,
      price: product.price,
      discountPrice: product.discountPrice,
      fabric: product.fabric,
      careInstructions: product.careInstructions,
      isFeatured:product.isFeatured || true,
      isBestSeller: product.isBestSeller || true,
      isNewArrival: product.isNewArrival ?? true,
    });
    setSizeStock(product.sizes?.length ? product.sizes : SIZES.map((s) => ({ size: s})));
    setSelectedFiles([]);
    setSelectedCollections(product.collections || []);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'sizes'|| key === 'collections')return;
      if(value !== undefined && value !== null) formData.append(key, value);
    });
    formData.append('sizes', JSON.stringify(sizeStock));
    formData.append('collections', JSON.stringify(selectedCollections));
    selectedFiles.forEach((file) => formData.append('images', file));

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData);
        toast.success('Product updated');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created');
      }
      setModalOpen(false);
      loadProducts();
    } catch {
      // error toasted globally
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    await productService.deleteProduct(id);
    toast.success('Product deleted');
    loadProducts();
  };

  const updateStock = (size,stock) => {
    setSizeStock((prev) => prev.map((s) => (s.size === size ?{...s,stock:Number(stock)} :s )));
  };

  const toggleCollection = (name) => {
    setSelectedCollections((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Products</h1>
        <Button onClick={openCreateModal} className="!py-2 !px-5"><FiPlus className="inline mr-1" /> Add Product</Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={['Image', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Actions']}
          data={products}
          renderRow={(p) => (
            <tr key={p._id} className="border-t border-beige/50">
              <td className="px-4 py-3"><img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-12 object-cover rounded" /></td>
              <td className="px-4 py-3">{p.name}</td>
              <td className="px-4 py-3">{p.sku}</td>
              <td className="px-4 py-3">{p.category?.name}</td>
              <td className="px-4 py-3">{formatCurrency(p.discountPrice || p.price)}</td>
              <td className="px-4 py-3">{p.sizes?.reduce((sum, s) => sum + s.stock, 0)}</td>
              <td className="px-4 py-3 flex gap-3">
                <button onClick={() => openEditModal(p)} className="text-gold"><FiEdit2 size={16} /></button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500"><FiTrash2 size={16} /></button>
              </td>
            </tr>
          )}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add Product'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input className="input-field" placeholder="Product Name" {...register('name', { required: true })} />
          <textarea className="input-field" rows={3} placeholder="Description" {...register('description', { required: true })} />
          <input className="input-field" placeholder="Short Description" {...register('shortDescription')} />

          <div className="grid grid-cols-2 gap-4">
            <select className="input-field" {...register('category', { required: true })}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input className="input-field" placeholder="SKU" {...register('sku', { required: true })} />
            <input type="number" className="input-field" placeholder="Price" {...register('price', { required: true })} />
            <input type="number" className="input-field" placeholder="Discount Price (optional)" {...register('discountPrice')} />
          </div>

          <input className="input-field" placeholder="Fabric" {...register('fabric', { required: true })} />
          <input className="input-field" placeholder="Care Instructions" {...register('careInstructions', { required: true })} />

          <div>
            <p className="text-sm font-medium mb-2">Stock by Size</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {sizeStock.map((s) => (
                <div key={s.size}>
                  <label className="text-xs">{s.size}</label>
                  <input
                    onChange={(e) => updateStock(s.size, e.target.value)}
                    className="input-field py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Collections</p>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleCollection(c)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    selectedCollections.includes(c)
                      ? 'bg-gold text-ivory border-gold'
                      : 'border-beige hover:border-gold'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
<div>
            <p className="text-sm font-medium mb-2">Homepage Visibility</p>
            <p className="text-xs text-charcoal/50 mb-2">
              These control which homepage sections show this product — separate from Collections above, which controls category/collection filtering in the shop.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isFeatured')} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isBestSeller')} />
                Best Seller
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isNewArrival')} />
                New Arrival
              </label>
            </div>
          </div>

          
          <div>
            <p className="text-sm font-medium mb-2">Product Images {editingProduct && '(adds to existing)'}</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              className="text-sm"
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
