import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Modal } from '../../components/admin/AdminUI';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import bannerService from '../../services/bannerService';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { position: 'hero', ctaText: 'Shop Now', link: '/shop' },
  });

  const loadBanners = async () => {
    setLoading(true);
    const res = await bannerService.getAllBanners();
    setBanners(res.banners);
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const onSubmit = async (data) => {
    if (!file) {
      toast.error('Please select a banner image');
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append('image', file);

    try {
      await bannerService.createBanner(formData);
      toast.success('Banner created');
      reset();
      setFile(null);
      setModalOpen(false);
      loadBanners();
    } catch {
      // toasted globally
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    await bannerService.deleteBanner(id);
    toast.success('Banner deleted');
    loadBanners();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Banners</h1>
        <Button onClick={() => setModalOpen(true)} className="!py-2 !px-5"><FiPlus className="inline mr-1" /> Add Banner</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => (
          <div key={b._id} className="card overflow-hidden">
            <img src={b.image?.url} alt={b.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{b.title}</p>
                <p className="text-xs text-charcoal/50">{b.position} · {b.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <button onClick={() => handleDelete(b._id)} className="text-red-500"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-sm text-charcoal/50">No banners yet.</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Banner">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input className="input-field" placeholder="Title" {...register('title', { required: true })} />
          <input className="input-field" placeholder="Subtitle" {...register('subtitle')} />
          <input className="input-field" placeholder="CTA Text" {...register('ctaText')} />
          <input className="input-field" placeholder="Link (e.g. /shop?collection=Wedding Collection)" {...register('link')} />
          <select className="input-field" {...register('position')}>
            <option value="hero">Hero</option>
            <option value="secondary">Secondary</option>
            <option value="promo-strip">Promo Strip</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="submit" isLoading={isSubmitting} className="w-full">Create Banner</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBanners;
