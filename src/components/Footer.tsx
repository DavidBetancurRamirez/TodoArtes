import { Link } from 'react-router-dom';

import { useContentful } from '../hooks/useContentful';

import { trackEvent } from '../lib/analytics';

import type {
  CollectionTodoArtes,
  UtilsTodoArtes,
} from '../types/contentfulTypes';

interface FooterProps {
  collections: CollectionTodoArtes['fields'][];
}

const Footer: React.FC<FooterProps> = ({ collections }) => {
  const { data } = useContentful<UtilsTodoArtes>('utils');
  const { name } = data[0] ?? {};

  return (
    <footer className="flex w-full flex-col md:flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-[#1c476d] p-6 md:justify-between">
      <Link to="/">
        <h4 className="text-white">{name ?? 'Todo Artes'}</h4>
      </Link>

      <ul className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8">
        {collections.map((collection) => (
          <li
            className="transition-colors duration-300 ease-in-out text-white"
            key={collection.value}
          >
            <Link
              to={`/collections/${collection.value}`}
              onClick={() =>
                trackEvent({
                  action: 'Click Footer Link',
                  category: 'Footer',
                  label: collection.value,
                })
              }
            >
              {collection.label}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
