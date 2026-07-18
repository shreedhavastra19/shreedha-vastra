import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from '../components/common/Helmet';
import Loader from '../components/common/Loader';
import orderService from '../services/orderService';
import { formatCurrency, formatDate, ORDER_STATUSES } from '../utils/helpers';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(id).then((res) => {
      setOrder(res.order);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!order) return null;

  const currentStepIndex = ORDER_STATUSES.indexOf(order.orderStatus);

  return (
    <div className="container-custom py-10 max-w-3xl">
      <Helmet title={`Order ${order.orderNumber} | Shreedha Vastra`} />
      <h1 className="font-serif text-3xl mb-2">Order {order.orderNumber}</h1>
      <p className="text-sm text-charcoal/50 mb-8">Placed on {formatDate(order.createdAt)}</p>

      {/* Status tracker */}
      {!['Cancelled', 'Returned'].includes(order.orderStatus) && (
        <div className="card p-6 mb-8">
          <div className="flex justify-between text-xs text-center">
            {['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, i) => (
              <div key={step} className="flex-1">
                <div
                  className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] mb-1 ${
                    i <= currentStepIndex ? 'bg-gold text-ivory' : 'bg-beige text-charcoal/40'
                  }`}
                >
                  {i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <p className="text-sm text-center mt-4">
              Tracking: <span className="font-medium">{order.trackingNumber}</span> {order.courierName && `(${order.courierName})`}
            </p>
          )}
          {order.estimatedDelivery && (
            <p className="text-xs text-center text-charcoal/50 mt-1">
              Estimated delivery: {formatDate(order.estimatedDelivery)}
            </p>
          )}
        </div>
      )}

      <div className="card p-6 mb-8">
        <h3 className="font-serif text-xl mb-4">Items</h3>
        <div className="space-y-4">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-charcoal/50">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-serif text-lg mb-3">Shipping Address</h3>
          <p className="text-sm text-charcoal/70">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}, {order.shippingAddress.line2 && `${order.shippingAddress.line2}, `}
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
            {order.shippingAddress.phone}
          </p>
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-lg mb-3">Payment Summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Items</span><span>{formatCurrency(order.itemsPrice)}</span></div>
            {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discountAmount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shippingPrice)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(order.taxPrice)}</span></div>
            <div className="flex justify-between font-semibold border-t border-beige pt-2 mt-2"><span>Total</span><span>{formatCurrency(order.totalPrice)}</span></div>
            <p className="text-xs text-charcoal/50 pt-2">
              Payment Method: {order.paymentMethod} · {order.isPaid ? 'Paid' : 'Pending'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
