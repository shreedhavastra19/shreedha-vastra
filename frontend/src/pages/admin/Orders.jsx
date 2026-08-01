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
  const [viewOrder, setViewOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ orderStatus: '', trackingNumber: '', courierName: '', note: '' });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({});
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
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
            <td className="px-4 py-3">{o.user?.name || o.guestInfo?.name || <span className="italic text-charcoal/40"> Guest</span>}</td>
            <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
            <td className="px-4 py-3">{formatCurrency(o.totalPrice)}</td>
            <td className="px-4 py-3">{o.orderStatus}</td>
            <td className="px-4 py-3">
              <button onClick={() => openStatusModal(o)} className="text-gold text-sm hover:underline">Update</button>
              <button onClick={() => setViewOrder(o)} className="text-gold text-sm hover:underline">View</button>
            </td>
          </tr>
        )}
      />
      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.orderNumber}`}>
        {viewOrder && (
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Customer</h4>
              <p>{viewOrder.user?.name || viewOrder.guestInfo?.name || 'Guest'}</p>
              <p>{viewOrder.user?.email || viewOrder.guestInfo?.email}</p>
              <p>{viewOrder.guestInfo?.phone || viewOrder.shippingAddress?.phone}</p>
              {!viewOrder.user && <p className="text-gold italic">Guest checkout</p>}
            </div>

            <div>
              <h4 className="font-semibold mb-1">Shipping Address</h4>
              <p>{viewOrder.shippingAddress?.fullName}</p>
              <p>{viewOrder.shippingAddress?.line1}</p>
              {viewOrder.shippingAddress?.line2 && <p>{viewOrder.shippingAddress.line2}</p>}
              <p>
                {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.state} {viewOrder.shippingAddress?.pincode}
              </p>
              <p>{viewOrder.shippingAddress?.country}</p>
              <p>Phone: {viewOrder.shippingAddress?.phone}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Items</h4>
              {viewOrder.orderItems?.map((item, i) => (
                <p key={i}>
                  {item.name} — {item.size}/{item.color} × {item.quantity} ({formatCurrency(item.price)})
                </p>
              ))}
            </div>

            <div>
              <h4 className="font-semibold mb-1">Payment</h4>
              <p>Method: {viewOrder.paymentMethod}</p>
              <p>Total: {formatCurrency(viewOrder.totalPrice)}</p>
              <p>Status: {viewOrder.isPaid ? 'Paid' : 'Pending'}</p>
            </div>
          </div>
        )}
      </Modal>

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
