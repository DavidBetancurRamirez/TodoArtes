import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CollectionNotFound from '../components/CollectionNotFound';

import axiosInstance from '../lib/axiosConfig';

import type { CollectionTodoArtes } from '../types/contentfulTypes';
import type { Product } from '../types/product';
import type { Collection as ApiCollection } from '../types/collection';

import { routes } from '../utils/routes';
import { getCollections } from '../utils/localStorage';

interface CollectionProps {
  collections: CollectionTodoArtes['fields'][];
}

const Collection: React.FC<CollectionProps> = ({ collections }) => {
  const { collection } = useParams<{ collection?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const foundCollection = collections.find((item) => item.value === collection);

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

  if (!foundCollection) {
    return <CollectionNotFound />;
  }

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
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  <img
                    src={foundCollection?.image?.fields?.file?.url}
                    alt={foundCollection.label}
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
                  <p className="text-xl font-bold text-green-600">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
