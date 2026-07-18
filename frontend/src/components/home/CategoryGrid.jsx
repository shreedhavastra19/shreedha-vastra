import { Link } from 'react-router-dom';

const CategoryGrid = ({ categories = [] }) => {
  if (categories.length === 0) return null;

  return (
    <section className="container-custom py-8">
      <h2 className="section-heading mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/shop?category=${cat._id}`}
            className="group flex flex-col items-center gap-3 animate-fadeIn"
          >
           <span className="px-6 py-3 rounded-full bg-peach-light border-2 border-transparent group-hover:border-gold transition-colors text-sm sm:text-base font-medium text-center">
  {cat.name}
</span>
           {/* <span className="text-sm sm:text-base font-medium text-center">{cat.name}</span> */}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
