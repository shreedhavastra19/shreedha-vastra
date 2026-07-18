import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import heroimage from './hero-image.jpg';

const FALLBACK_SLIDES = [
  {
    title: 'SHREEDHA\n VASTRA',
    subtitle: 'More than clothing-its your statement.',
    ctaText: 'Shop Now',
    link: '/shop?collection=Wedding Collection',
    image: heroimage,
  },
];

const HeroBanner = ({ banners = [] }) => {
  const slides = banners.length > 0 ? banners : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);
return (
  <section className="relative h-[42vh] sm:h-[55vh] md:h-[70vh] min-h-[280px] max-h-[720px] overflow-hidden bg-charcoal">
    {slides.map((s, i) => (
      <div
        key={i}
        className={`absolute inset-0 transition-opacity duration-700 ${
          i === active ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background image fills the whole frame */}
        <img
          src={s.image}
          alt={s.title}
          className="w-full h-full object-cover"
        />

        {/* Dark overlay so text stays readable on any image */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text sits on top of the image */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold whitespace-pre-line text-ivory">
            {s.title}
          </h1>
          <p className="mt-2 md:mt-4 text-sm sm:text-lg text-ivory">{s.subtitle}</p>
          <Link
            to={s.link || '/shop'}
            className="mt-4 md:mt-6 px-5 py-2 md:px-6 md:py-3 bg-darkred text-ivory rounded-full font-semibold text-sm md:text-base"
          >
            {s.ctaText || 'Shop Now'}
          </Link>
        </div>
      </div>
    ))}

    {slides.length > 1 && (
      <>
        <button
          onClick={() => setActive((active - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
          aria-label="Previous slide"
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={() => setActive((active + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
          aria-label="Next slide"
        >
          <FiChevronRight />
        </button>
      </>
    )}
  </section>
)};

 
  export default HeroBanner;