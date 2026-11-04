import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUpdateOwnProfile, useUploadOwnPhoto } from '../hooks/useApi';
import { resolveAssetUrl } from '../services/api';
import { TopBar } from '../components/TopBar';
import { Card, Button } from '../components/ui';
import './Profile.css';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const uploadPhoto = useUploadOwnPhoto();
  const updateProfile = useUpdateOwnProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? '');
  const [identification, setIdentification] = useState(user?.identification ?? '');
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? '');
  const [firstEmausRetreatDate, setFirstEmausRetreatDate] = useState(user?.firstEmausRetreatDate ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');

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

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updatedUser = await updateProfile.mutateAsync({
        name: name.trim(),
        identification: identification.trim(),
        birthDate: birthDate || undefined,
        firstEmausRetreatDate: firstEmausRetreatDate || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      });
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
          <section className="profile__identity">
            <div className="profile__avatar">
              {user.avatar ? (
                <img src={resolveAssetUrl(user.avatar)} alt={`Fotografía de ${user.name}`} />
              ) : (
                <span>Sin foto</span>
              )}
            </div>
            <div className="profile__identity-copy">
              <span className="profile__eyebrow">Cuenta personal</span>
              <h2>{user.name}</h2>
              <p>{user.email || 'Correo no registrado'}</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploadPhoto.isPending}
              >
                {uploadPhoto.isPending ? 'Subiendo...' : 'Cambiar fotografía'}
              </Button>
            </div>
          </section>
          <p className="profile__hint profile__photo-hint">JPG, PNG o WEBP · Máximo 5 MB</p>
          {uploadPhoto.isError && (
            <p className="profile__error" role="alert">
              {uploadPhoto.error instanceof Error
                ? uploadPhoto.error.message
                : 'No se pudo actualizar la fotografía.'}
            </p>
          )}
          <section className="profile__summary">
            <div className="profile__section-heading">
              <div>
                <span className="profile__eyebrow">Información visible</span>
                <h2>Resumen de tu perfil</h2>
              </div>
            </div>
            <dl className="profile__details">
              <div><dt>Nombre</dt><dd>{user.name}</dd></div>
              <div><dt>Correo</dt><dd>{user.email || 'No registrado'}</dd></div>
              <div><dt>Identificación</dt><dd>{user.identification}</dd></div>
            </dl>
          </section>
          <form onSubmit={handleProfileSubmit} className="profile__edit">
            <div className="profile__section-heading">
              <div>
                <span className="profile__eyebrow">Datos personales</span>
                <h2>Editar información</h2>
              </div>
              <p>Los cambios se guardarán en tu cuenta.</p>
            </div>
            <div className="profile__form-grid">
              <label className="profile__field profile__field--wide">
                <span>Nombre completo</span>
                <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={150} />
              </label>
              <label className="profile__field profile__field--wide">
                <span>Identificación</span>
                <input value={identification} onChange={(event) => setIdentification(event.target.value)} required maxLength={50} />
              </label>
              <label className="profile__field profile__field--wide">
                <span>Número de celular</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="Ej. 300 123 4567"
                  maxLength={30}
                />
              </label>
              <label className="profile__field">
                <span>Fecha de nacimiento</span>
                <input type="date" value={birthDate ?? ''} onChange={(event) => setBirthDate(event.target.value)} />
              </label>
              <label className="profile__field">
                <span>Primer retiro Emaús</span>
                <input type="date" value={firstEmausRetreatDate ?? ''} onChange={(event) => setFirstEmausRetreatDate(event.target.value)} />
              </label>
            </div>
            {updateProfile.isError && (
              <p className="profile__error" role="alert">
                {updateProfile.error instanceof Error ? updateProfile.error.message : 'No se pudo actualizar el perfil.'}
              </p>
            )}
            {updateProfile.isSuccess && <p className="profile__hint">Perfil actualizado correctamente.</p>}
            <div className="profile__actions">
              <Button type="submit" isLoading={updateProfile.isPending}>Guardar cambios</Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};
