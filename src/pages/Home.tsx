import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';

import Accordion from '../components/Accordion';
import Loader from '../components/Loader';
import Product from '../components/Product';

import { useContentful } from '../hooks/useContentful';

import axiosInstance from '../lib/axiosConfig';

import type {
  CollectionTodoArtes,
  HomePageTodoArtes,
  StoreTodoArtes,
} from '../types/contentfulTypes';
import type { Product as ProductType } from '../types/product';
import type { Rating } from '../types/rating';

import { deleteProductAPI } from '../utils/api';
import { routes } from '../utils/routes';

interface HomeProps {
  collections: CollectionTodoArtes['fields'][];
  getProductRating: (productId: number) => number;
  onRatingChange: (productId: number, rating: number) => void;
  ratings: Rating[];
}

const Home = ({
  collections,
  getProductRating,
  onRatingChange,
  ratings,
}: HomeProps) => {
  const { data: dataHomePage, loading: loadingHomePage } =
    useContentful<HomePageTodoArtes>('homePage');
  const { data: dataStores, loading: loadingStores } =
    useContentful<StoreTodoArtes>('store');

  const auth = useAuth();
  const clientSub = auth.user?.profile?.sub as string;

  const [productsRecommended, setProductsRecommended] = useState<ProductType[]>(
    [],
  );

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const recommendationsData = await axiosInstance.get(
          routes.recommendations,
          {
            params: { client_sub: clientSub },
          },
        );
        const recommendations =
          recommendationsData?.data?.recommendations || [];
        if (!recommendations?.length) {
          setProductsRecommended([]);
          return;
        }

        const recommendedProductsResponse = await axiosInstance.get(
          routes.products,
          {
            params: { ids: recommendations.join(',') },
          },
        );
        const recommendedProducts = recommendedProductsResponse?.data || [];
        if (!recommendedProducts?.length) {
          setProductsRecommended([]);
          return;
        }

        // Sort products to match the order of recommendations
        const sortedProducts = recommendations
          .map((id: number) =>
            recommendedProducts.find(
              (product: ProductType) => product.id === id,
            ),
          )
          .filter((product: ProductType | undefined) => product !== undefined);

        setProductsRecommended(sortedProducts);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setProductsRecommended([]);
      }
    };

    getRecommendations();
  }, [clientSub]);

  if (loadingHomePage && loadingStores) return <Loader />;

  const handleDelete = async (productId: number) => {
    try {
      await deleteProductAPI(productId);
      setProductsRecommended((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId),
      );
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const {
    mainImage,
    recommendationTitle,
    recommendationText,
    storesTitle,
    storesLabel,
  } = dataHomePage[0] || {};

  return (
    <React.Fragment>
      {/* Main Image */}
      {mainImage?.fields?.file?.url && (
        <img
          src={mainImage.fields.file.url}
          alt={mainImage?.fields?.description || 'Banner'}
          className="w-full"
        />
      )}

      {/* Recommendations */}
      <div>
        <div className="mt-6 flex flex-col items-center text-center gap-4">
          <h2 className="text-2xl font-bold">
            {recommendationTitle ?? 'Recomendaciones'}
          </h2>
          {recommendationText && recommendationText.length >= 2 && (
            <p>
              {ratings.length > 0
                ? recommendationText[0]
                : recommendationText[1]}
            </p>
          )}
        </div>

        <div className="p-8">
          {productsRecommended.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Por el momento no hay recomendaciones disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {productsRecommended.map((product) => {
                const foundCollection = collections?.find(
                  (item) => item.id === product.collection_id,
                );

                return (
                  <Product
                    key={product.id}
                    product={product}
                    imageUrl={foundCollection?.image?.fields?.file?.url}
                    imageAlt={foundCollection?.label ?? ''}
                    clientSub={clientSub}
                    currentRating={getProductRating(product.id)}
                    onDelete={handleDelete}
                    onRatingChange={onRatingChange}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stores */}
      {dataStores && dataStores.length > 0 && (
        <div className="bg-[#3880c4] text-center text-white py-8 space-y-4">
          <h3 className="font-bold uppercase">
            {storesLabel ?? 'Siempre cerca de ti'}
          </h3>
          <h2 className="text-6xl font-bold uppercase">
            {storesTitle ?? 'Tiendas'}
          </h2>
          <div className="w-[80%] mx-auto">
            {dataStores.map((store, index) => (
              <Accordion
                key={index}
                borderButton={index === dataStores.length - 1}
                {...store}
              />
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Home;
