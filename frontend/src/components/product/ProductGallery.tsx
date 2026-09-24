import { useState } from "react";
import { cloudinaryImg } from "../../utils/imageUrl";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-square bg-gray-100 rounded-lg" />;
  }

  return (
    <div>
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={cloudinaryImg(images[activeIndex], 1200)}
          alt={productName}
          width={1200}
          height={1200}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-16 rounded overflow-hidden border-2 ${
                idx === activeIndex ? "border-black" : "border-transparent"
              }`}
            >
              <img src={cloudinaryImg(img, 256)} alt={`${productName} ${idx + 1}`} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
