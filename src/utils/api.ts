import axiosInstance from '../lib/axiosConfig';
import { routes } from './routes';
import type { Collection } from '../types/collection';
import type { Product, CreateProduct, UpdateProduct } from '../types/product';

/**
 * Obtiene las collections desde la API
 * @returns Promise con las collections obtenidas
 */
export const fetchCollectionsFromAPI = async (): Promise<Collection[]> => {
  try {
    const response = await axiosInstance.get(routes.collections);
    return response.data;
  } catch (error) {
    console.error('Error fetching collections from API:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por ID desde la API
 * @param id - ID del producto
 * @returns Promise con el producto obtenido
 */
export const fetchProductByIdFromAPI = async (id: number): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`${routes.products}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product from API:', error);
    throw error;
  }
};

/**
 * Crea un nuevo producto en la API
 * @param product - Datos del producto a crear
 * @returns Promise con el producto creado
 */
export const createProductAPI = async (
  product: CreateProduct,
): Promise<Product> => {
  try {
    const response = await axiosInstance.post(routes.products, product);
    return response.data;
  } catch (error) {
    console.error('Error creating product in API:', error);
    throw error;
  }
};

/**
 * Actualiza un producto en la API
 * @param product - Datos del producto a actualizar
 * @returns Promise con el producto actualizado
 */
export const updateProductAPI = async (
  product: UpdateProduct,
): Promise<Product> => {
  try {
    const response = await axiosInstance.put(
      `${routes.products}/${product.id}`,
      product,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating product in API:', error);
    throw error;
  }
};
