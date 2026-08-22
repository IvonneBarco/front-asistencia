import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUploadOwnPhoto } from '../hooks/useApi';
import { resolveAssetUrl } from '../services/api';
import { TopBar } from '../components/TopBar';
import { Card, Button } from '../components/ui';
import './Profile.css';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const uploadPhoto = useUploadOwnPhoto();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return null;
  }

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const updatedUser = await uploadPhoto.mutateAsync(file);
      updateUser(updatedUser);
    } catch {
      // El mensaje de error se muestra en la vista.
    }
  };

  return (
    <div className="profile">
      <TopBar isAdmin={user.role === 'admin'} />
      <main className="profile__container">
        <header className="profile__header">
          <h1>Mi perfil</h1>
          <p>Tu información personal</p>
        </header>

        <Card variant="elevated" padding="lg" className="profile__card">
          <div className="profile__avatar">
            {user.avatar ? (
              <img src={resolveAssetUrl(user.avatar)} alt={`Fotografía de ${user.name}`} />
            ) : (
              <span>Sin foto</span>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
          <Button
            variant="primary"
            onClick={() => inputRef.current?.click()}
            disabled={uploadPhoto.isPending}
          >
            {uploadPhoto.isPending ? 'Subiendo...' : 'Cambiar fotografía'}
          </Button>
          <p className="profile__hint">JPG, PNG o WEBP. Máximo 5 MB. Se optimiza automáticamente.</p>
          {uploadPhoto.isError && (
            <p className="profile__error" role="alert">
              {uploadPhoto.error instanceof Error
                ? uploadPhoto.error.message
                : 'No se pudo actualizar la fotografía.'}
            </p>
          )}
          <dl className="profile__details">
            <div><dt>Nombre</dt><dd>{user.name}</dd></div>
            <div><dt>Correo</dt><dd>{user.email || 'No registrado'}</dd></div>
            <div><dt>Identificación</dt><dd>{user.identification}</dd></div>
          </dl>
        </Card>
      </main>
    </div>
  );
};
