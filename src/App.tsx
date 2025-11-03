import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { VapiWidget } from '@vapi-ai/client-sdk-react';

import Layout from './components/Layout';

import { useContentful } from './hooks/useContentful';

import axiosInstance from './lib/axiosConfig';

import Collection from './pages/Collection';
import Collections from './pages/Collections';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import ProductForm from './pages/ProductForm';

import type { CollectionTodoArtes } from './types/contentfulTypes';
import type { Rating } from './types/rating';

import { collectionsExist, saveCollections } from './utils/localStorage';
import { fetchCollectionsFromAPI } from './utils/api';
import { routes } from './utils/routes';

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const App = () => {
  const { data: contentfulCollections } =
    useContentful<CollectionTodoArtes>('collection');

  const auth = useAuth();
  const clientSub = auth.user?.profile?.sub as string;

  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    const loadApiCollections = async () => {
      try {
        // Verificar si existen collections en localStorage
        if (collectionsExist()) {
          return;
        }

        // Si no existen en localStorage, hacer petición a la API
        const collections = await fetchCollectionsFromAPI();
        saveCollections(collections);
      } catch (error) {
        console.error('Error loading API collections:', error);
      }
    };

    loadApiCollections();
  }, []);

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

  // Sort collections by id (assuming id is a number)
  const sortedCollections = [...contentfulCollections].sort(
    (a, b) => a.id - b.id,
  );

  return (
    <Layout collections={sortedCollections}>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              collections={sortedCollections}
              ratings={ratings}
              onRatingChange={handleRatingChange}
              getProductRating={getProductRating}
            />
          }
        />
        <Route
          path="/collections"
          element={<Collections collections={sortedCollections} />}
        />
        <Route
          path="/collections/:collection?"
          element={
            <Collection
              collections={sortedCollections}
              onRatingChange={handleRatingChange}
              getProductRating={getProductRating}
            />
          }
        />
        <Route path="/products/form/:id?" element={<ProductForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <VapiWidget
        publicKey={PUBLIC_KEY}
        assistantId={ASSISTANT_ID}
        mode="hybrid"
        position="bottom-right"
        theme="dark"
        accentColor="#1c476d"
        title="TodoArtes AI"
        chatPlaceholder="Pregúntame por tus recomendaciones..."
        chatFirstMessage="¡Hola! Soy tu asistente de TodoArtes 🎨. Puedo recomendarte productos según tus gustos y mostrarte sus detalles (nombre, descripción y precio). Pregúntame por tus recomendaciones o productos favoritos, ¡puedes hablarme o escribirme!"
        voiceShowTranscript={true}
        assistantOverrides={{
          variableValues: { client_sub: clientSub },
        }}
      />
    </Layout>
  );
};

export default App;
