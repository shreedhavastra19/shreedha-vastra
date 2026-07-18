import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating = 0, size = 16, showCount, count }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-gold text-gold' : 'text-beige'}
        />
      ))}
      {showCount && <span className="text-xs text-charcoal/60 ml-1">({count || 0})</span>}
    </div>
  );
};

export default StarRating;
