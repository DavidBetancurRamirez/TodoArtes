import axiosInstance from '../lib/axiosConfig';
import { routes } from './routes';
import type { Collection } from '../types/collection';

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
