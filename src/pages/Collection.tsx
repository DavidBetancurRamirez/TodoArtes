import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

import CollectionNotFound from '../components/CollectionNotFound';
import Product from '../components/Product';

import axiosInstance from '../lib/axiosConfig';

import type { CollectionTodoArtes } from '../types/contentfulTypes';
import type { Product as ProductType } from '../types/product';
import type { Collection as ApiCollection } from '../types/collection';
import type { Rating } from '../types/rating';

import { routes } from '../utils/routes';
import { getCollections } from '../utils/localStorage';
import { deleteProductAPI } from '../utils/api';

interface CollectionProps {
  collections: CollectionTodoArtes['fields'][];
}

const Collection: React.FC<CollectionProps> = ({ collections }) => {
  const { collection } = useParams<{ collection?: string }>();
  const auth = useAuth();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [error, setError] = useState<string | null>(null);

  const foundCollection = collections.find((item) => item.value === collection);
  const clientSub = auth.user?.profile?.sub as string;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!foundCollection) return;

      try {
        setError(null);

        const apiCollection = getCollections<ApiCollection>()?.find(
          (item) =>
            item.name.toLowerCase() === foundCollection.value.toLowerCase(),
        );
        if (!apiCollection) {
          setProducts([]);
          return;
        }

        const response = await axiosInstance.get(routes.products, {
          params: { collection_id: apiCollection?.id || 1 },
        });

        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setError('Error fetching products. Please try again later.');
      }
    };

    fetchProducts();
  }, [foundCollection]);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!clientSub) return;

      try {
        const response = await axiosInstance.get(routes.ratings, {
          params: { client_sub: clientSub },
        });

        setRatings(response.data);
      } catch (err) {
        console.error('Error fetching ratings:', err);
        setRatings([]);
      }
    };

    fetchRatings();
  }, [clientSub]);

  if (!foundCollection) {
    return <CollectionNotFound />;
  }

  const handleDelete = async (productId: number) => {
    try {
      await deleteProductAPI(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId),
      );
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error deleting product. Please try again later.');
    }
  };

  const handleRatingChange = (productId: number, rating: number) => {
    setRatings((prevRatings) => {
      const existingRatingIndex = prevRatings.findIndex(
        (r) => r.product_id === productId,
      );

      if (existingRatingIndex >= 0) {
        const updatedRatings = [...prevRatings];
        updatedRatings[existingRatingIndex] = {
          ...updatedRatings[existingRatingIndex],
          rating,
        };
        return updatedRatings;
      } else {
        return [
          ...prevRatings,
          {
            client_sub: clientSub,
            product_id: productId,
            rating,
          },
        ];
      }
    });
  };

  const getProductRating = (productId: number): number => {
    const rating = ratings.find((r) => r.product_id === productId);
    return rating?.rating || 0;
  };

  return (
    <div>
      <div className="p-8 flex space-x-8">
        <div className="w-4/5 space-y-8">
          <h3 className="text-6xl font-bold capitalize">
            {foundCollection.label}
          </h3>
          <p className="text-lg text-gray-700">{foundCollection.description}</p>
        </div>
        <div className="w-1/5 flex items-center justify-center">
          <img
            src={foundCollection?.image?.fields?.file?.url}
            alt={foundCollection.label}
            className="max-w-full max-h-[200px] object-contain rounded-xl shadow"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay productos disponibles en esta colección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <Product
                key={product.id}
                product={product}
                imageUrl={foundCollection?.image?.fields?.file?.url}
                imageAlt={foundCollection.label}
                clientSub={clientSub}
                currentRating={getProductRating(product.id)}
                onDelete={handleDelete}
                onRatingChange={handleRatingChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
