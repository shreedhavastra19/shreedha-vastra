import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, message, ctaText, ctaLink }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 px-4 animate-fadeIn">
    {Icon && <Icon size={56} className="text-gold/50 mb-4" />}
    <h3 className="font-serif text-2xl mb-2">{title}</h3>
    <p className="text-charcoal/60 dark:text-ivory/60 max-w-sm mb-6">{message}</p>
    {ctaText && ctaLink && (
      <Link to={ctaLink} className="btn-primary">
        {ctaText}
      </Link>
    )}
  </div>
);

export default EmptyState;
