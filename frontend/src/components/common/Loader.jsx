import { FiLoader } from 'react-icons/fi';

const Loader = ({ fullScreen = false, size = 32 }) => {
  const spinner = (
    <FiLoader className="animate-spin text-gold" size={size} aria-label="Loading" />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-ivory/80 dark:bg-charcoal/80 z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-10">{spinner}</div>;
};

export default Loader;
