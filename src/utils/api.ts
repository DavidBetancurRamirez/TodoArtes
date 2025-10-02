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
    const collections = response?.data;

    if (!collections || !Array.isArray(collections)) {
      throw new Error(
        'Error al obtener las colecciones: respuesta inválida del servidor',
      );
    }

    return collections;
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
    const response = await axiosInstance.get(`${routes.products}?id=${id}`);
    const products = response?.data;

    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    return products[0];
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

    if (!response?.data) {
      throw new Error(
        'Error al crear el producto: respuesta vacía del servidor',
      );
    }

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
    const response = await axiosInstance.patch(
      `${routes.products}?id=${product.id}`,
      product,
    );

    if (!response?.data) {
      throw new Error(
        'Error al actualizar el producto: respuesta vacía del servidor',
      );
    }

    return response.data;
  } catch (error) {
    console.error('Error updating product in API:', error);
    throw error;
  }
};

/**
 * Elimina un producto por ID desde la API
 * @param id - ID del producto a eliminar
 * @returns Promise con la confirmación de eliminación
 */
export const deleteProductAPI = async (id: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`${routes.products}?id=${id}`);

    if (!response || response.status < 200 || response.status >= 300) {
      throw new Error(`Error al eliminar el producto con ID ${id}`);
    }
  } catch (error) {
    console.error('Error deleting product from API:', error);
    throw error;
  }
};
