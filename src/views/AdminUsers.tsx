import React, { useState } from 'react';
import { useCreateBulkUsers, useUploadUsersCSV, useUploadUserPhoto, useGetAllUsers } from '../hooks/useApi';
import { Card, Button, Badge } from '../components/ui';
import { BulkUserForm } from '../components/BulkUserForm';
import { CSVUpload } from '../components/CSVUpload';
import { TopBar } from '../components/TopBar';
import { GroupAssignModal } from '../components/GroupAssignModal';
import type { BulkUserInput, CSVImportResponse, User } from '../types';
import { resolveAssetUrl } from '../services/api';
import './AdminUsers.css';

type TabType = 'form' | 'csv' | 'list';

export const AdminUsers: React.FC = () => {
  const createBulkUsers = useCreateBulkUsers();
  const uploadCSV = useUploadUsersCSV();
  const uploadUserPhoto = useUploadUserPhoto();
  const { data: usersData, isLoading: loadingUsers } = useGetAllUsers();
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [csvResult, setCsvResult] = useState<CSVImportResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [uploadingPhotoUserId, setUploadingPhotoUserId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const users = Array.isArray(usersData) ? usersData : [];
  const normalizedSearch = userSearch.trim().toLocaleLowerCase();
  const filteredUsers = users.filter((user) => {
    if (!normalizedSearch) {
      return true;
    }

    return [user.name, user.identification, user.email]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase().includes(normalizedSearch));
  });

  const handleCreateUsers = async (users: BulkUserInput[]) => {
    try {
      const result = await createBulkUsers.mutateAsync({ users });
      setCreatedCount(result.created.length);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error creating users:', error);
    }
  };

  const handleUploadCSV = async (file: File) => {
    try {
      const result = await uploadCSV.mutateAsync(file);
      setCsvResult(result);
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  };

  const handlePhotoUpload = async (userId: string, file?: File) => {
    if (!file) {
      return;
    }

    try {
      setUploadingPhotoUserId(userId);
      await uploadUserPhoto.mutateAsync({ userId, file });
    } catch (error) {
      console.error('Error uploading user photo:', error);
    } finally {
      setUploadingPhotoUserId(null);
    }
  };

  return (
    <div className="admin-users">
      <TopBar isAdmin={true} />
      <div className="admin-users__container">
        <header className="admin-users__header">
          <h1 className="admin-users__title">Gestión de Usuarios</h1>
          <p className="admin-users__subtitle">
            Crear usuarios de forma individual o masiva
          </p>
        </header>

        {showSuccess && (
          <Card variant="elevated" padding="md" className="admin-users__success">
            <div className="admin-users__success-content">
              <span className="admin-users__success-icon">✅</span>
              <div>
                <h3 className="admin-users__success-title">
                  ¡Usuarios creados exitosamente!
                </h3>
                <p className="admin-users__success-message">
                  Se {createdCount === 1 ? 'creó' : 'crearon'} {createdCount}{' '}
                  usuario{createdCount > 1 ? 's' : ''} correctamente.
                </p>
              </div>
            </div>
          </Card>
        )}

        {createBulkUsers.isError && (
          <Card variant="elevated" padding="md" className="admin-users__error">
            <div className="admin-users__error-content">
              <span className="admin-users__error-icon">❌</span>
              <div>
                <h3 className="admin-users__error-title">Error al crear usuarios</h3>
                <p className="admin-users__error-message">
                  {createBulkUsers.error instanceof Error
                    ? createBulkUsers.error.message
                    : 'Ocurrió un error inesperado'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {uploadCSV.isError && (
          <Card variant="elevated" padding="md" className="admin-users__error">
            <div className="admin-users__error-content">
              <span className="admin-users__error-icon">❌</span>
              <div>
                <h3 className="admin-users__error-title">Error al importar CSV</h3>
                <p className="admin-users__error-message">
                  {uploadCSV.error instanceof Error
                    ? uploadCSV.error.message
                    : 'Ocurrió un error inesperado'}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card variant="elevated" padding="lg" className="admin-users__form-card">
          <div className="admin-users__tabs">
            <button
              className={`admin-users__tab ${activeTab === 'list' ? 'admin-users__tab--active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              Usuarios
            </button>
            <button
              className={`admin-users__tab ${activeTab === 'form' ? 'admin-users__tab--active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              Registrar
            </button>
            <button
              className={`admin-users__tab ${activeTab === 'csv' ? 'admin-users__tab--active' : ''}`}
              onClick={() => setActiveTab('csv')}
            >
              Importar
            </button>
          </div>

          {activeTab === 'list' ? (
            <>
              <h2 className="admin-users__form-title">Usuarios Registrados</h2>
              {loadingUsers ? (
                <div className="admin-users__loading">Cargando usuarios...</div>
              ) : users.length === 0 ? (
                <p className="admin-users__empty">
                  No hay usuarios registrados todavía.
                </p>
              ) : (
                <>
                  <div className="admin-users__search-wrapper">
                    <label htmlFor="admin-users-search" className="admin-users__search-label">
                      Buscar usuario
                    </label>
                    <input
                      id="admin-users-search"
                      type="search"
                      value={userSearch}
                      onChange={(event) => setUserSearch(event.target.value)}
                      placeholder="Nombre, identificación o correo"
                      className="admin-users__search"
                    />
                  </div>

                  {filteredUsers.length === 0 ? (
                    <p className="admin-users__empty">
                      No se encontraron usuarios con “{userSearch}”.
                    </p>
                  ) : (
                    <div className="admin-users__list">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="admin-users__list-item">
                      <div className="admin-users__avatar-block">
                        <div className="admin-users__avatar">
                          {user.avatar ? (
                            <img
                              src={resolveAssetUrl(user.avatar)}
                              alt={`Fotografía de ${user.name}`}
                              className="admin-users__avatar-image"
                            />
                          ) : (
                            <div className="admin-users__avatar-placeholder">
                              <span>Sin foto</span>
                            </div>
                          )}
                        </div>
                        <div className="admin-users__photo-actions">
                          <label className="admin-users__photo-upload">
                            <span>
                              {uploadingPhotoUserId === user.id
                                ? 'Subiendo...'
                                : 'Seleccionar fotografía'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="admin-users__photo-input"
                              onChange={(event) => {
                                void handlePhotoUpload(user.id, event.target.files?.[0]);
                                event.target.value = '';
                              }}
                              disabled={uploadingPhotoUserId === user.id}
                            />
                          </label>
                          <p className="admin-users__photo-hint">
                            JPG, PNG o WEBP. Máximo 5 MB. Se optimiza automáticamente.
                          </p>
                        </div>
                      </div>
                      <div className="admin-users__user-info">
                        <div>
                          <p className="admin-users__user-name">{user.name}</p>
                          <p className="admin-users__user-details">
                            ID: {user.identification} • {user.email}
                          </p>
                        </div>
                        <div className="admin-users__user-stats">
                          <Badge variant="warning" size="sm">
                            {user.flowers} 🌸
                          </Badge>
                          {user.group && (
                            <Badge variant="default" size="sm">
                              {user.group.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        Gestionar Grupo
                      </Button>
                    </div>
                  ))}
                    </div>
                  )}
                </>
              )}
            </>
          ) : activeTab === 'form' ? (
            <>
              <h2 className="admin-users__form-title">Crear Nuevos Usuarios</h2>
              <BulkUserForm
                onSubmit={handleCreateUsers}
                isLoading={createBulkUsers.isPending}
              />
            </>
          ) : (
            <>
              <h2 className="admin-users__form-title">Importar desde CSV</h2>
              <CSVUpload
                onUpload={handleUploadCSV}
                isLoading={uploadCSV.isPending}
                result={csvResult}
              />
            </>
          )}
        </Card>

        <div className="admin-users__info">
          <Card variant="outlined" padding="md">
            <h3 className="admin-users__info-title">💡 Información</h3>
            <ul className="admin-users__info-list">
              <li>El PIN debe ser de 4 dígitos numéricos</li>
              <li>El correo electrónico debe ser único por usuario</li>
              <li>Puedes agregar múltiples usuarios a la vez</li>
              <li>Los usuarios creados podrán iniciar sesión inmediatamente</li>
              <li>Cada usuario puede actualizar su fotografía desde Mi perfil</li>
            </ul>
            
            <h3 className="admin-users__info-title" style={{ marginTop: '1rem' }}>📄 Formato CSV</h3>
            <ul className="admin-users__info-list">
              <li><strong>Columnas:</strong> name, email, pin, role</li>
              <li><strong>Puede incluir encabezado o no</strong></li>
              <li><strong>Valores de role:</strong> user o admin</li>
            </ul>
            
            <div className="admin-users__csv-example">
              <div>name,email,pin,role</div>
              <div>María García,maria@emaus.com,1234,user</div>
              <div>Ana Martínez,ana@emaus.com,5678,user</div>
              <div>Isabel Rodríguez,isabel@emaus.com,9012,admin</div>
            </div>
          </Card>
        </div>

        {selectedUser && (
          <GroupAssignModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
};
