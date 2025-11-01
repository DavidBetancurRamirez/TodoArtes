import { useAuth } from 'react-oidc-context';
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from './Loader';
import { createOrUpdateUserAPI } from '../utils/api';

interface AuthProps {
  children: React.ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const createUserIfNotExists = useCallback(async () => {
    try {
      const profile = auth.user?.profile;

      // Verificar que las propiedades necesarias existan
      if (!profile?.email || !profile?.name || !profile?.sub) {
        console.error('Faltan propiedades del perfil del usuario');
        auth.signinRedirect();
        return;
      }

      // Hacer el POST con los datos del usuario
      await createOrUpdateUserAPI({
        email: profile.email,
        name: profile.name,
        sub: profile.sub,
      });

      console.log('Usuario creado/actualizado exitosamente');
    } catch (error) {
      console.error('Error al crear/actualizar usuario:', error);
      auth.signinRedirect();
    }
  }, [auth]);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }

    if (!auth.isAuthenticated) {
      auth.signinRedirect();
      return;
    }

    if (
      auth.isAuthenticated &&
      window.location.search.includes('code=') &&
      window.location.search.includes('state=')
    ) {
      createUserIfNotExists();
      navigate('/');
    }
  }, [
    auth.isLoading,
    auth.isAuthenticated,
    auth,
    navigate,
    createUserIfNotExists,
  ]);

  if (auth.isLoading) {
    return <Loader />;
  }

  if (auth.error) {
    console.error('auth error', auth.error);
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default Auth;
