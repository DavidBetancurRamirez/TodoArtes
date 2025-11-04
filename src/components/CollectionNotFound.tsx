import { Link } from 'react-router-dom';

import Loader from './Loader';

import { useContentful } from '../hooks/useContentful';

import { trackEvent } from '../lib/analytics';

import type { CollectionNotFoundTodoArtes } from '../types/contentfulTypes';

const CollectionNotFound = () => {
  const { data, loading } =
    useContentful<CollectionNotFoundTodoArtes>('collectionNotFound');

  if (loading) return <Loader />;

  const { title, description, buttonText } = data[0] || {};

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
      <Link
        to="/collections"
        onClick={() =>
          trackEvent({
            action: 'Click Errors Pages Link',
            category: 'Collections',
            label: 'Collections',
          })
        }
      >
        <button className="mt-4 px-6 py-4 bg-[#3880c4] text-white rounded-4xl font-bold cursor-pointer hover:bg-[#2a5f8c] transition-colors">
          {buttonText}
        </button>
      </Link>
    </div>
  );
};

export default CollectionNotFound;
