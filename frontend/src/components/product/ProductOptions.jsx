// ================================================================
// Shreedha Vastra — Size Selector, Color Selector, Quantity Selector
// ================================================================
import { FiMinus, FiPlus } from 'react-icons/fi';

export const SizeSelector = ({ sizes = [], selectedSize, onSelect }) => (
  <div>
    <h4 className="text-sm font-medium mb-2">Size</h4>
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const outOfStock = s.stock === 0;
        return (
          <button
            key={s.size}
            disabled={outOfStock}
            onClick={() => onSelect(s.size)}
            className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
              selectedSize === s.size
                ? 'bg-gold text-ivory border-gold'
                : outOfStock
                ? 'border-beige text-charcoal/30 line-through cursor-not-allowed'
                : 'border-beige hover:border-gold'
            }`}
          >
            {s.size}
          </button>
        );
      })}
    </div>
  </div>
);

export const ColorSelector = ({ colors = [], selectedColor, onSelect }) => (
  <div>
    <h4 className="text-sm font-medium mb-2">Color</h4>
    <div className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelect(c.name)}
          title={c.name}
          className={`w-9 h-9 rounded-full border-2 transition-transform ${
            selectedColor === c.name ? 'border-gold scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  </div>
);

export const QuantitySelector = ({ quantity, onChange, max = 10 }) => (
  <div>
    <h4 className="text-sm font-medium mb-2">Quantity</h4>
    <div className="flex items-center border border-beige rounded-full w-fit">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="w-10 h-10 flex items-center justify-center hover:text-gold"
        aria-label="Decrease quantity"
      >
        <FiMinus size={14} />
      </button>
      <span className="w-8 text-center font-medium">{quantity}</span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="w-10 h-10 flex items-center justify-center hover:text-gold"
        aria-label="Increase quantity"
      >
        <FiPlus size={14} />
      </button>
    </div>
  </div>
);
