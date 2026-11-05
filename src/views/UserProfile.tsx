import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUpdateUserPersonalData, useUserProfile } from '../hooks/useApi';
import { resolveAssetUrl } from '../services/api';
import { TopBar } from '../components/TopBar';
import { Card, Button } from '../components/ui';
import './Profile.css';

const formatDate = (value?: string | null) =>
  value ? new Date(`${value}T00:00:00`).toLocaleDateString('es-CO') : 'No registrada';

export const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: viewer } = useAuth();
  const { data: profile, isLoading, error } = useUserProfile(userId);
  const update = useUpdateUserPersonalData();
  const [birthDate, setBirthDate] = useState('');
  const [retreatDate, setRetreatDate] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setBirthDate(profile.birthDate ?? '');
      setRetreatDate(profile.firstEmausRetreatDate ?? '');
      setPhone(profile.phoneNumber ?? '');
    }
  }, [profile]);

  if (isLoading) return <p>Cargando perfil...</p>;
  if (error || !profile) return <p>No se pudo cargar el perfil.</p>;

  const editing = viewer?.role === 'admin';
  const rawWhatsappNumber = profile.phoneNumber?.replace(/\D/g, '');
  const whatsappNumber = rawWhatsappNumber && rawWhatsappNumber.length === 10
    ? `57${rawWhatsappNumber}`
    : rawWhatsappNumber;

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await update.mutateAsync({
        userId: profile.id,
        data: {
          birthDate: birthDate || undefined,
          firstEmausRetreatDate: retreatDate || undefined,
          phoneNumber: phone || undefined,
        },
      });
      setIsEditing(false);
    } catch {
      // El mensaje de error se muestra en el formulario.
    }
  };

  return (
    <div className="profile">
      <TopBar isAdmin={viewer?.role === 'admin'} />
      <main className="profile__container">
        <header className="profile__header">
          <h1>Perfil de {profile.name}</h1>
          <p>Información personal</p>
        </header>
        <Card variant="elevated" padding="lg" className="profile__card">
          <div className="profile__avatar">
            {profile.avatar ? <img src={resolveAssetUrl(profile.avatar)} alt={`Fotografía de ${profile.name}`} /> : <span>Sin foto</span>}
          </div>
          {editing && !isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Editar información
            </Button>
          )}
          {editing && isEditing && (
            <form className="profile__edit profile__edit--admin" onSubmit={save}>
              <div className="profile__section-heading">
                <div>
                  <span className="profile__eyebrow">Edición administrativa</span>
                  <h2>Actualizar información</h2>
                </div>
              </div>
              <div className="profile__form-grid">
                <label className="profile__field">
                  <span>Fecha de nacimiento</span>
                  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </label>
                <label className="profile__field">
                  <span>Primer retiro Emaús</span>
                  <input type="date" value={retreatDate} onChange={(e) => setRetreatDate(e.target.value)} />
                </label>
                <label className="profile__field profile__field--wide">
                  <span>Número de celular</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 300 123 4567" />
                </label>
              </div>
              {update.isError && (
                <p className="profile__error" role="alert">
                  {update.error instanceof Error ? update.error.message : 'No se pudo actualizar la información.'}
                </p>
              )}
              <div className="profile__actions">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={update.isPending}>Guardar cambios</Button>
              </div>
            </form>
          )}
          <dl className="profile__details">
            <div><dt>Nombre</dt><dd>{profile.name}</dd></div>
            <div><dt>Fecha de nacimiento</dt><dd>{formatDate(profile.birthDate)}</dd></div>
            <div><dt>Primer retiro Emaús</dt><dd>{formatDate(profile.firstEmausRetreatDate)}</dd></div>
            {editing && (
              <div>
                <dt>Celular</dt>
                <dd>{whatsappNumber ? <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">{profile.phoneNumber}</a> : 'No registrado'}</dd>
              </div>
            )}
            {profile.group && <div><dt>Grupo</dt><dd>{profile.group.name}</dd></div>}
          </dl>
          <Link to="/ranking">Volver al ranking</Link>
        </Card>
      </main>
    </div>
  );
};
