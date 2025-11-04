import { Link } from 'react-router-dom';

import { useContentful } from '../hooks/useContentful';

import { trackEvent } from '../lib/analytics';

import type {
  CollectionTodoArtes,
  UtilsTodoArtes,
} from '../types/contentfulTypes';

interface CollectionsProps {
  collections: CollectionTodoArtes['fields'][];
}

const Collections: React.FC<CollectionsProps> = ({ collections }) => {
  const { data } = useContentful<UtilsTodoArtes>('utils');
  const { collectionsTitle } = data[0] ?? {};

  return (
    <div className="p-8">
      <h3 className="text-6xl font-bold mb-8">
        {collectionsTitle ?? 'Collections'}
      </h3>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        {collections.map(
          (collection: CollectionTodoArtes['fields'], idx: number) => (
            <Link
              key={idx}
              className="h-auto transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer flex flex-col items-center"
              to={`/collections/${collection.value}`}
              onClick={() =>
                trackEvent({
                  action: 'Click Collection Link',
                  category: 'Collections',
                  label: collection.value,
                })
              }
            >
              <h4 className="text-xl font-semibold">{collection?.label}</h4>
              <img
                src={collection?.image?.fields?.file?.url}
                alt={collection.label}
                className="max-w-full max-h-[500px] object-contain rounded-xl shadow"
              />
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default Collections;
