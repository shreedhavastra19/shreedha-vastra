import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Modal } from '../../components/admin/AdminUI';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import categoryService from '../../services/categoryService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadCategories = async () => {
    setLoading(true);
    const res = await categoryService.getCategories();
    setCategories(res.categories);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append('image', file);

    try {
      await categoryService.createCategory(formData);
      toast.success('Category created');
      reset();
      setFile(null);
      setModalOpen(false);
      loadCategories();
    } catch {
      // toasted globally
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products in this category will be affected.')) return;
    await categoryService.deleteCategory(id);
    toast.success('Category deleted');
    loadCategories();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Categories</h1>
        <Button onClick={() => setModalOpen(true)} className="!py-2 !px-5"><FiPlus className="inline mr-1" /> Add Category</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c) => (
          <div key={c._id} className="card overflow-hidden">
            <img src={c.image?.url || '/placeholder-category.jpg'} alt={c.name} className="w-full h-32 object-cover" />
            <div className="p-4 flex items-center justify-between">
              <p className="font-medium text-sm">{c.name}</p>
              <button onClick={() => handleDelete(c._id)} className="text-red-500"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Category">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input className="input-field" placeholder="Category Name" {...register('name', { required: true })} />
          <textarea className="input-field" placeholder="Description" {...register('description')} />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="submit" isLoading={isSubmitting} className="w-full">Create Category</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
