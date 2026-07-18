// ================================================================
// Shreedha Vastra — Cart Page
// ================================================================
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';
import EmptyState from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';

const Cart = () => {
  const navigate = useNavigate();
  const { cart: items, loading, updateQuantity, removeFromCart, cartTotal: total } = useCart();

  if (!loading && items.length === 0) {
    return (
      <EmptyState
        icon={FiShoppingBag}
        title="Your cart is empty"
        message="Looks like you haven't added anything yet. Explore our collections to find something you'll love."
        ctaText="Continue Shopping"
        ctaLink="/shop"
      />
    );
  }

  return (
    <div className="container-custom py-10">
      <Helmet title="Your Cart | Shreedha Vastra" />
      <h1 className="font-serif text-3xl mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex gap-4 card p-4">
              <img src={item.image} alt={item.name} className="w-24 h-28 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-xs text-charcoal/50 mt-1">
                  Size: {item.size} {item.color && `· Color: ${item.color}`}
                </p>
                <p className="font-semibold mt-2">{formatCurrency(item.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-beige rounded-full">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h3 className="font-serif text-xl mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <p className="text-xs text-charcoal/50 mb-4">Shipping and taxes calculated at checkout.</p>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full">
            Proceed to Checkout
          </button>
          <Link to="/shop" className="block text-center text-sm text-gold mt-4 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
