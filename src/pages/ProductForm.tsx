import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { productInitialState } from '../types/product';
import type { Collection } from '../types/collection';
import type { Product, CreateProduct, UpdateProduct } from '../types/product';

import { getCollections } from '../utils/localStorage';
import {
  createProductAPI,
  fetchProductByIdFromAPI,
  updateProductAPI,
} from '../utils/api';

const ProductForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Estado del formulario
  const [formData, setFormData] = useState<CreateProduct>(productInitialState);

  // Estados de la UI
  const [message, setMessage] = useState<{
    value: string;
    type: 'error' | 'success';
  } | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Cargar collections del localStorage
  useEffect(() => {
    const loadCollections = () => {
      try {
        const storedCollections = getCollections<Collection>();
        if (storedCollections && storedCollections.length > 0) {
          setCollections(storedCollections);
        } else {
          setMessage({
            type: 'error',
            value: 'No se encontraron colecciones disponibles',
          });
        }
      } catch (error) {
        console.error('Error loading collections from localStorage:', error);
        setMessage({
          type: 'error',
          value: 'Error al cargar las colecciones',
        });
      }
    };

    loadCollections();
  }, []);

  // Cargar producto si estamos editando
  useEffect(() => {
    if (isEditing && id) {
      const loadProduct = async () => {
        try {
          const product: Product = await fetchProductByIdFromAPI(parseInt(id));
          setFormData({
            collection_id: product.collection_id,
            description: product.description || '',
            name: product.name,
            price: product.price,
          });
        } catch (error) {
          console.error('Error loading product:', error);
          setMessage({
            type: 'error',
            value: 'Error al cargar el producto',
          });
        }
      };
      loadProduct();
    }
  }, [isEditing, id]);

  // Manejar cambios en el formulario
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'collection_id'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setMessage({
        type: 'error',
        value: 'El nombre del producto es requerido',
      });
      return false;
    }
    if (formData.price <= 0) {
      setMessage({
        type: 'error',
        value: 'El precio debe ser mayor a 0',
      });
      return false;
    }
    if (formData.collection_id <= 0) {
      setMessage({
        type: 'error',
        value: 'Debe seleccionar una colección',
      });
      return false;
    }
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && id) {
        const updateData: UpdateProduct = {
          ...formData,
          id: parseInt(id),
        };
        await updateProductAPI(updateData);
        setMessage({
          type: 'success',
          value: 'Producto actualizado exitosamente',
        });
      } else {
        await createProductAPI(formData);
        setMessage({
          type: 'success',
          value: 'Producto creado exitosamente',
        });
      }

      setFormData(productInitialState);
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage({
        type: 'error',
        value: isEditing
          ? 'Error al actualizar el producto'
          : 'Error al crear el producto',
      });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del producto */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del producto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el nombre del producto"
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese una descripción del producto"
            />
          </div>

          {/* Precio */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Precio *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Colección */}
          <div>
            <label
              htmlFor="collection_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Colección *
            </label>
            <select
              id="collection_id"
              name="collection_id"
              value={formData.collection_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>Seleccione una colección</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
            >
              Eliminar
            </button>
          </div>

          {/* Mensajes */}
          {message && (
            <div
              className={`px-4 py-3 rounded mt-4 ${
                message.type === 'error'
                  ? 'bg-red-100 border border-red-400 text-red-700'
                  : 'bg-green-100 border border-green-400 text-green-700'
              }`}
            >
              {message.value}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
