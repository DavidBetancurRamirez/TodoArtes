import type { EntrySkeletonType } from 'contentful';

export type ContentfulModel<TFields> = {
  fields: TFields;
} & EntrySkeletonType;

export type ImageType = ContentfulModel<{
  title: string;
  description: string;
  file: {
    url: string;
    fileName: string;
    contentType: string;
  };
}>;

// Contentful model types
export type StoreTodoArtes = ContentfulModel<{
  address?: string;
  city?: string;
  location?: string;
  name: string;
  phone?: string;
  schedule?: string;
}>;

export type CollectionTodoArtes = ContentfulModel<{
  description?: string;
  id: number;
  image?: ImageType;
  label: string;
  value: string;
}>;

export type CollectionNotFoundTodoArtes = ContentfulModel<{
  buttonText: string;
  description: string;
  title: string;
}>;

export type HomePageTodoArtes = ContentfulModel<{
  mainImage?: ImageType;
  recommendations?: ImageType[];
  recommendationText?: string[];
  recommendationTitle: string;
  storesLabel?: string;
  storesTitle?: string;
}>;

export type NotFoundTodoArtes = ContentfulModel<{
  buttonText?: string;
  description?: string;
  errorCode?: string;
  errorMessage?: string;
}>;

export type ProfileTodoArtes = ContentfulModel<{
  emailLabel?: string;
  nameLabel?: string;
  noAuthenticated?: string;
  signOutLabel?: string;
}>;

export type UtilsTodoArtes = ContentfulModel<{
  collectionsTitle?: string;
  logo: ImageType;
  name: string;
}>;
