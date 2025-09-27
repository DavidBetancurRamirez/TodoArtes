import React from 'react';

import Accordion from '../components/Accordion';
import Loader from '../components/Loader';

import { useContentful } from '../hooks/useContentful';

import type {
  HomePageTodoArtes,
  ImageType,
  StoreTodoArtes,
} from '../types/contentfulTypes';

const Home = () => {
  const { data: dataHomePage, loading: loadingHomePage } =
    useContentful<HomePageTodoArtes>('homePage');
  const { data: dataStores, loading: loadingStores } =
    useContentful<StoreTodoArtes>('store');

  if (loadingHomePage && loadingStores) return <Loader />;

  const {
    mainImage,
    recommendationTitle,
    recommendationText,
    recommendations,
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
      {recommendations && recommendations?.length > 0 && (
        <div>
          <div className="mt-6 flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl font-bold">
              {recommendationTitle ?? 'Recomendaciones'}
            </h2>
            {recommendationText && recommendationText.length > 0 && (
              <p>
                {recommendationText.map((text: string, idx: number) => (
                  <React.Fragment key={idx}>
                    {text}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-8 my-6">
            {recommendations.map((rec: ImageType, idx: number) => (
              <div
                key={idx}
                className="h-auto transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer flex flex-col items-center"
              >
                <img
                  src={rec?.fields?.file?.url}
                  alt={rec?.fields?.description || `Recomendación ${idx + 1}`}
                />
                <p className="text-lg">
                  {rec?.fields?.description || 'Kit recomendado'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

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
