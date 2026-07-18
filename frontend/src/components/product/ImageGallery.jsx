// ================================================================
// Shreedha Vastra — Product Image Gallery with Hover Zoom
// ================================================================
import { useState, useRef } from 'react';

const ImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef(null);

  const activeImage = images[activeIndex]?.url || '/placeholder-product.jpg';

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img.public_id || i}
            onClick={() => setActiveIndex(i)}
            className={`w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
              i === activeIndex ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image with hover zoom */}
      <div
        ref={containerRef}
        className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-beige/40 cursor-zoom-in"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage}
          alt="Product"
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZooming ? 'scale-150' : 'scale-100'
          }`}
          style={isZooming ? zoomStyle : {}}
        />
      </div>
    </div>
  );
};

export default ImageGallery;
