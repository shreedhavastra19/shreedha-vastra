import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';
import orderService from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
const statusColor = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Returned: 'bg-gray-100 text-gray-700',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 const { isAuthenticated } = useAuth();

useEffect(() => {
  const loadOrders = async () => {
    if (isAuthenticated) {
      const res = await orderService.getMyOrders();
      setOrders(res.orders);
    } else {
      const guestOrderIds = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      const results = await Promise.all(
        guestOrderIds.map((id) =>
          orderService.getOrderById(id).then((res) => res.order).catch(() => null)
        )
      );
      setOrders(results.filter(Boolean).reverse());
    }
    setLoading(false);
  };
  loadOrders();
}, [isAuthenticated]);

  if (loading) return <Loader fullScreen />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={FiPackage}
        title="No orders yet"
        message="Once you place an order, it will show up here."
        ctaText="Start Shopping"
        ctaLink="/shop"
      />
    );
  }

  return (
    <div className="container-custom py-10">
      <Helmet title="My Orders | Shreedha Vastra" />
      <h1 className="font-serif text-3xl mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 flex items-center justify-between hover:shadow-gold">
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-xs text-charcoal/50">{formatDate(order.createdAt)} · {order.orderItems.length} item(s)</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[order.orderStatus] || 'bg-gray-100'}`}>
                {order.orderStatus}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
