import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBulkUsers, useUploadUsersCSV } from '../hooks/useApi';
import { Card, Button, Badge } from '../components/ui';
import { BulkUserForm } from '../components/BulkUserForm';
import { CSVUpload } from '../components/CSVUpload';
import { TopBar } from '../components/TopBar';
import type { BulkUserInput, CSVImportResponse } from '../types';
import './AdminUsers.css';

type TabType = 'form' | 'csv';

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const createBulkUsers = useCreateBulkUsers();
  const uploadCSV = useUploadUsersCSV();
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [csvResult, setCsvResult] = useState<CSVImportResponse | null>(null);

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
              className={`admin-users__tab ${activeTab === 'form' ? 'admin-users__tab--active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              📝 Formulario
            </button>
            <button
              className={`admin-users__tab ${activeTab === 'csv' ? 'admin-users__tab--active' : ''}`}
              onClick={() => setActiveTab('csv')}
            >
              📄 Importar CSV
            </button>
          </div>

          {activeTab === 'form' ? (
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
            </ul>
            
            <h3 className="admin-users__info-title" style={{ marginTop: '1rem' }}>📄 Formato CSV</h3>
            <ul className="admin-users__info-list">
              <li><strong>Columnas:</strong> name, email, pin, role</li>
              <li><strong>Puede incluir encabezado o no</strong></li>
              <li><strong>Valores de role:</strong> user o admin</li>
            </ul>
            
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--color-background)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              <div>name,email,pin,role</div>
              <div>María García,maria@emaus.com,1234,user</div>
              <div>Ana Martínez,ana@emaus.com,5678,user</div>
              <div>Isabel Rodríguez,isabel@emaus.com,9012,admin</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
