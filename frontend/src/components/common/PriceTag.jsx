import { formatCurrency } from '../../utils/helpers';

const PriceTag = ({ price, discountPrice, size = 'md' }) => {
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base';
  const hasDiscount = discountPrice && discountPrice < price;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`font-semibold text-charcoal dark:text-ivory ${textSize}`}>
        {formatCurrency(hasDiscount ? discountPrice : price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-charcoal/40 line-through text-sm">{formatCurrency(price)}</span>
          <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full font-medium">
            {Math.round(((price - discountPrice) / price) * 100)}% OFF
          </span>
        </>
      )}
    </div>
  );
};

export default PriceTag;
