import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DataTable, Modal } from '../../components/admin/AdminUI';
import Loader from '../../components/common/Loader';
import orderService from '../../services/orderService';
import { formatCurrency, formatDate, ORDER_STATUSES } from '../../utils/helpers';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ orderStatus: '', trackingNumber: '', courierName: '', note: '' });

  const loadOrders = async () => {
    setLoading(true);
    const res = await orderService.getAllOrders({});
    setOrders(res.orders);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusForm({ orderStatus: order.orderStatus, trackingNumber: order.trackingNumber || '', courierName: order.courierName || '', note: '' });
  };

  const handleUpdateStatus = async () => {
    await orderService.updateOrderStatus(selectedOrder._id, statusForm);
    toast.success('Order updated');
    setSelectedOrder(null);
    loadOrders();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Orders</h1>

      <DataTable
        columns={['Order #', 'Customer', 'Date', 'Total', 'Status', 'Actions']}
        data={orders}
        renderRow={(o) => (
          <tr key={o._id} className="border-t border-beige/50">
            <td className="px-4 py-3">{o.orderNumber}</td>
            <td className="px-4 py-3">{o.user?.name}</td>
            <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
            <td className="px-4 py-3">{formatCurrency(o.totalPrice)}</td>
            <td className="px-4 py-3">{o.orderStatus}</td>
            <td className="px-4 py-3">
              <button onClick={() => openStatusModal(o)} className="text-gold text-sm hover:underline">Update</button>
            </td>
          </tr>
        )}
      />

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Update Order ${selectedOrder?.orderNumber}`}>
        <div className="space-y-4">
          <select
            className="input-field"
            value={statusForm.orderStatus}
            onChange={(e) => setStatusForm({ ...statusForm, orderStatus: e.target.value })}
          >
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            placeholder="Tracking Number"
            className="input-field"
            value={statusForm.trackingNumber}
            onChange={(e) => setStatusForm({ ...statusForm, trackingNumber: e.target.value })}
          />
          <input
            placeholder="Courier Name"
            className="input-field"
            value={statusForm.courierName}
            onChange={(e) => setStatusForm({ ...statusForm, courierName: e.target.value })}
          />
          <textarea
            placeholder="Internal note (optional)"
            className="input-field"
            value={statusForm.note}
            onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
          />
          <button onClick={handleUpdateStatus} className="btn-primary w-full">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrders;
