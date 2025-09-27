/**
 * Utilidades para el manejo del localStorage
 */

const STORAGE_KEYS = {
  COLLECTIONS: 'todoArtes_collections',
} as const;

/**
 * Guarda datos en el localStorage
 * @param key - Clave para almacenar los datos
 * @param data - Datos a almacenar
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Obtiene datos del localStorage
 * @param key - Clave de los datos a obtener
 * @returns Los datos almacenados o null si no existen
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

/**
 * Elimina datos del localStorage
 * @param key - Clave de los datos a eliminar
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Verifica si existen datos en el localStorage
 * @param key - Clave de los datos a verificar
 * @returns true si existen los datos, false en caso contrario
 */
export const existsInLocalStorage = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error('Error checking localStorage:', error);
    return false;
  }
};

// Funciones específicas para collections
/**
 * Guarda las collections en el localStorage
 * @param collections - Array de collections a guardar
 */
export const saveCollections = <T>(collections: T[]): void => {
  saveToLocalStorage(STORAGE_KEYS.COLLECTIONS, collections);
};

/**
 * Obtiene las collections del localStorage
 * @returns Las collections almacenadas o null si no existen
 */
export const getCollections = <T>(): T[] | null => {
  return getFromLocalStorage<T[]>(STORAGE_KEYS.COLLECTIONS);
};

/**
 * Verifica si existen collections en el localStorage
 * @returns true si existen collections, false en caso contrario
 */
export const collectionsExist = (): boolean => {
  return existsInLocalStorage(STORAGE_KEYS.COLLECTIONS);
};

/**
 * Elimina las collections del localStorage
 */
export const removeCollections = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.COLLECTIONS);
};
