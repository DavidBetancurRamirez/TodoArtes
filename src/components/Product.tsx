import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash, Star } from 'lucide-react';

import axiosInstance from '../lib/axiosConfig';

import type { Product as ProductType } from '../types/product';

import { routes } from '../utils/routes';

interface ProductProps {
  clientSub: string;
  currentRating?: number;
  imageAlt: string;
  imageUrl?: string;
  onDelete: (productId: number) => void;
  onRatingChange: (productId: number, rating: number) => void;
  product: ProductType;
}

const Product: React.FC<ProductProps> = ({
  clientSub,
  currentRating = 0,
  imageAlt,
  imageUrl,
  onDelete,
  onRatingChange,
  product,
}) => {
  const navigate = useNavigate();
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRating = async (rating: number) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      onRatingChange(product.id, rating);
      await axiosInstance.post(routes.ratings, {
        client_sub: clientSub,
        product_id: product.id,
        rating: rating,
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
      <div className="aspect-square bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h5 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h5>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {product.description}
          </p>
        )}
        <p className="text-xl font-bold text-green-600 mb-3">
          ${product.price.toLocaleString()}
        </p>

        {/* Rating Stars */}
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = (hoveredStar || currentRating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                disabled={isSubmitting}
                className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed"
                title={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
              >
                <Star
                  size={20}
                  fill={isActive ? '#FCD34D' : '#D1D5DB'}
                  color={isActive ? '#F59E0B' : '#9CA3AF'}
                  className="transition-colors duration-150"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex space-x-2 my-2 mr-2 justify-end">
        {/* Edit icon */}
        <button
          type="button"
          title="Editar"
          onClick={() => navigate(`/products/form/${product.id}`)}
          className="rounded hover:bg-gray-100 cursor-pointer"
        >
          <Edit color="blue" />
        </button>
        {/* Delete icon */}
        <button
          type="button"
          title="Eliminar"
          onClick={() => onDelete(product.id)}
          className="rounded hover:bg-gray-100 cursor-pointer"
        >
          <Trash color="red" />
        </button>
      </div>
    </div>
  );
};

export default Product;
