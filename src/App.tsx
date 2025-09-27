import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import Layout from './components/Layout';

import { useContentful } from './hooks/useContentful';

import Collection from './pages/Collection';
import Collections from './pages/Collections';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

import type { CollectionTodoArtes } from './types/contentfulTypes';

import { collectionsExist, saveCollections } from './utils/localStorage';
import { fetchCollectionsFromAPI } from './utils/api';

const App = () => {
  const { data: contentfulCollections } =
    useContentful<CollectionTodoArtes>('collection');

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

  return (
    <Layout collections={contentfulCollections}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/collections"
          element={<Collections collections={contentfulCollections} />}
        />
        <Route
          path="/collections/:collection?"
          element={<Collection collections={contentfulCollections} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
