import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { DataTable, Modal } from '../../components/admin/AdminUI';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import couponService from '../../services/couponService';
import { formatDate } from '../../utils/helpers';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadCoupons = async () => {
    setLoading(true);
    const res = await couponService.getCoupons();
    setCoupons(res.coupons);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const onSubmit = async (data) => {
    try {
      await couponService.createCoupon(data);
      toast.success('Coupon created');
      reset();
      setModalOpen(false);
      loadCoupons();
    } catch {
      // toasted globally
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    await couponService.deleteCoupon(id);
    toast.success('Coupon deleted');
    loadCoupons();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Coupons</h1>
        <Button onClick={() => setModalOpen(true)} className="!py-2 !px-5"><FiPlus className="inline mr-1" /> Add Coupon</Button>
      </div>

      <DataTable
        columns={['Code', 'Discount', 'Min Order', 'Expiry', 'Used', 'Actions']}
        data={coupons}
        renderRow={(c) => (
          <tr key={c._id} className="border-t border-beige/50">
            <td className="px-4 py-3 font-medium">{c.code}</td>
            <td className="px-4 py-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
            <td className="px-4 py-3">₹{c.minOrderValue}</td>
            <td className="px-4 py-3">{formatDate(c.expiryDate)}</td>
            <td className="px-4 py-3">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</td>
            <td className="px-4 py-3">
              <button onClick={() => handleDelete(c._id)} className="text-red-500"><FiTrash2 size={16} /></button>
            </td>
          </tr>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Coupon">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input className="input-field" placeholder="Coupon Code (e.g. WELCOME10)" {...register('code', { required: true })} />
          <select className="input-field" {...register('discountType', { required: true })}>
            <option value="percentage">Percentage Discount</option>
            <option value="flat">Flat Discount (₹)</option>
          </select>
          <input type="number" className="input-field" placeholder="Discount Value" {...register('discountValue', { required: true })} />
          <input type="number" className="input-field" placeholder="Minimum Order Value" {...register('minOrderValue')} />
          <input type="number" className="input-field" placeholder="Max Discount Amount (for %, optional)" {...register('maxDiscountAmount')} />
          <input type="date" className="input-field" {...register('expiryDate', { required: true })} />
          <input type="number" className="input-field" placeholder="Usage Limit (optional)" {...register('usageLimit')} />
          <Button type="submit" isLoading={isSubmitting} className="w-full">Create Coupon</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
