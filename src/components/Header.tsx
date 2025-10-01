import { LibraryBig, PlusCircle, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useContentful } from '../hooks/useContentful';

import { trackEvent } from '../lib/analytics';

import type {
  CollectionTodoArtes,
  UtilsTodoArtes,
} from '../types/contentfulTypes';

interface HeaderProps {
  collections: CollectionTodoArtes['fields'][];
}

const Header: React.FC<HeaderProps> = ({ collections }) => {
  const { data } = useContentful<UtilsTodoArtes>('utils');
  const { logo } = data[0] ?? {};

  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-10 py-3 bg-white">
      <Link
        to="/"
        className="flex items-center"
        onClick={() =>
          trackEvent({
            action: 'Click Nav Link',
            category: 'Navbar',
            label: 'Home',
          })
        }
      >
        <img
          src={
            logo?.fields?.file.url ??
            'https://todoenartes.com/cdn/shop/files/LOGO_TEA.png?height=48&v=1748131301'
          }
          alt={logo?.fields?.title || 'Logo'}
          className="h-12 w-44"
        />
      </Link>

      <div className="flex space-x-4 group">
        {collections.map((collection, index) => {
          const isActive =
            location.pathname === `/collections/${collection.value}`;

          return (
            <Link
              key={index}
              to={`/collections/${collection.value}`}
              className={`text-black font-semibold transition-colors ${
                isActive
                  ? 'underline'
                  : 'group-hover:text-gray-600 hover:!text-black'
              }`}
              onClick={() =>
                trackEvent({
                  action: 'Click Nav Link',
                  category: 'Navbar',
                  label: collection.value,
                })
              }
            >
              {collection.label}
            </Link>
          );
        })}
      </div>

      <div className="flex space-x-4">
        <Link
          to={`/collections`}
          onClick={() =>
            trackEvent({
              action: 'Click Nav Link',
              category: 'Navbar',
              label: 'Collections',
            })
          }
        >
          <LibraryBig size={18} />
        </Link>
        <Link
          to={`/products/form`}
          onClick={() =>
            trackEvent({
              action: 'Click Nav Link',
              category: 'Navbar',
              label: 'Create Product',
            })
          }
        >
          <PlusCircle size={18} />
        </Link>
        <Link
          to={`/profile`}
          onClick={() =>
            trackEvent({
              action: 'Click Nav Link',
              category: 'Navbar',
              label: 'Profile',
            })
          }
        >
          <UserRound size={18} />
        </Link>
      </div>
    </nav>
  );
};

export default Header;
