import type { Collection } from './collection';

// Product interface
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  collection_id: number;
}

// Extended Product interface with collection data included
export interface ProductWithCollection extends Omit<Product, 'collection_id'> {
  collection: Collection;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  collection_id: number;
}

export interface UpdateProduct {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  collection_id?: number;
}
