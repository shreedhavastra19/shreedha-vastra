// ================================================================
// Shreedha Vastra — Checkout Page
// ================================================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from '../components/common/Helmet';
import Button from '../components/common/Button';
import userService from '../services/userService';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import couponService from '../services/couponService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';

const PAYMENT_METHODS = [
  { value: 'Razorpay', label: 'UPI / Card / Net Banking (Razorpay)' },
  
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart: items, cartTotal: itemsTotal, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [guestEmail, setGuestEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');

    if (user) {
      userService.getAddresses().then(({ addresses }) => {
        setAddresses(addresses);
        const def = addresses.find((a) => a.isDefault) || addresses[0];
        if (def) setSelectedAddressId(def._id);
      });
    } else {
      setNewAddress(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const shippingEstimate = itemsTotal >= 1999 ? 0 : 99;
  const taxEstimate = Math.round((itemsTotal - discount) * 0.05);
  const grandTotal = itemsTotal - discount + shippingEstimate + taxEstimate;

  const handleApplyCoupon = async () => {
    try {
      const { discountAmount } = await couponService.applyCoupon(couponCode, itemsTotal);
      setDiscount(discountAmount);
      toast.success('Coupon applied!');
    } catch {
      setDiscount(0);
    }
  };

  const handleSaveNewAddress = async () => {
    const { addresses } = await userService.addAddress(addressForm);
    setAddresses(addresses);
    setSelectedAddressId(addresses[addresses.length - 1]._id);
    setNewAddress(false);
    toast.success('Address saved');
  };

  const getShippingAddress = () => {
    if (!user) {
      const { fullName, phone, line1, line2, city, state, pincode, country } = addressForm;
      if (!fullName || !phone || !line1 || !city || !state || !pincode) return null;
      return { fullName, phone, line1, line2, city, state, pincode, country };
    }
    const addr = addresses.find((a) => a._id === selectedAddressId);
    if (!addr) return null;
    const { fullName, phone, line1, line2, city, state, pincode, country } = addr;
    return { fullName, phone, line1, line2, city, state, pincode, country };
  };

  const handlePlaceOrder = async () => {
    const shippingAddress = getShippingAddress();
    if (!shippingAddress) {
      toast.error('Please fill in a complete shipping address');
      return;
    }
    if (!user && !guestEmail) {
      toast.error('Please enter your email so we can send your order confirmation');
      return;
    }

    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.product?._id || i.product,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      }));

      const { order } = await orderService.createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
        couponCode: couponCode || undefined,
        guestInfo: user
          ? undefined
          : { name: shippingAddress.fullName, email: guestEmail, phone: shippingAddress.phone },
      });

      const confirmationPath = user ? `/orders/${order._id}` : `/order-confirmation/${order._id}`;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Could not load payment gateway. Please try again.');
        setPlacing(false);
        return;
      }

      const { razorpayOrderId, amount, currency, keyId } = await paymentService.createRazorpayOrder(
        order.totalPrice,
        order._id
      );

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: 'Shreedha Vastra',
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            await clearCart();
            toast.success('Payment successful! Order confirmed.');
            if (!user) {
  const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
  guestOrders.push(order._id);
  localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
}
            navigate(confirmationPath);
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: shippingAddress.phone },
        theme: { color: '#B08D57' },
        modal: { ondismiss: () => setPlacing(false) },
      });

      rzp.open();
    } catch (err) {
      // error already toasted globally
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-custom py-10">
      <Helmet title="Checkout | Shreedha Vastra" />
      <h1 className="font-serif text-3xl mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-8">
          <section className="card p-6">
            <h3 className="font-serif text-xl mb-4">Shipping Address</h3>

            {!user ? (
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Email (for order updates)" type="email" className="input-field sm:col-span-2" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                <input placeholder="Full Name" className="input-field" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} />
                <input placeholder="Phone" className="input-field" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} />
                <input placeholder="Address Line 1" className="input-field sm:col-span-2" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} />
                <input placeholder="Address Line 2 (optional)" className="input-field sm:col-span-2" value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} />
                <input placeholder="City" className="input-field" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
                <input placeholder="State" className="input-field" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
                <input placeholder="Pincode" className="input-field" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} />
                <p className="text-xs text-charcoal/50 sm:col-span-2">
                  Have an account? <a href="/login" className="text-gold hover:underline">Log in</a> to use a saved address and track this order later.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`block p-4 rounded-lg border cursor-pointer ${
                        selectedAddressId === addr._id ? 'border-gold bg-gold/5' : 'border-beige'
                      }`}
                    >
                      <input
                        type="radio"
                        className="mr-2"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                      />
                      <span className="font-medium">{addr.fullName}</span> — {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
                    </label>
                  ))}
                </div>

                {!newAddress ? (
                  <button onClick={() => setNewAddress(true)} className="text-gold text-sm mt-4 hover:underline">
                    + Add a new address
                  </button>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <input placeholder="Full Name" className="input-field" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} />
                    <input placeholder="Phone" className="input-field" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} />
                    <input placeholder="Address Line 1" className="input-field sm:col-span-2" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} />
                    <input placeholder="Address Line 2 (optional)" className="input-field sm:col-span-2" value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} />
                    <input placeholder="City" className="input-field" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
                    <input placeholder="State" className="input-field" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
                    <input placeholder="Pincode" className="input-field" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} />
                    <div className="flex gap-2 sm:col-span-2">
                      <Button onClick={handleSaveNewAddress}>Save Address</Button>
                      <Button variant="outline" onClick={() => setNewAddress(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="card p-6">
            <h3 className="font-serif text-xl mb-4">Payment Method</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === pm.value}
                    onChange={() => setPaymentMethod(pm.value)}
                  />
                  {pm.label}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="card p-6 h-fit">
          <h3 className="font-serif text-xl mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span className="truncate max-w-[60%]">{item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="input-field py-2 text-sm"
            />
            <Button onClick={handleApplyCoupon} className="whitespace-nowrap py-2 px-4">Apply</Button>
          </div>

          <div className="space-y-2 text-sm border-t border-beige pt-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(itemsTotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{shippingEstimate === 0 ? 'Free' : formatCurrency(shippingEstimate)}</span></div>
            <div className="flex justify-between"><span>Tax (GST)</span><span>{formatCurrency(taxEstimate)}</span></div>
            <div className="flex justify-between font-semibold text-base border-t border-beige pt-2 mt-2">
              <span>Total</span><span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <Button onClick={handlePlaceOrder} isLoading={placing} className="w-full mt-6">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;