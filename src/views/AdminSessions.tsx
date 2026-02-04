import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useSessions,
  useCreateSession,
  useDeactivateSession,
} from '../hooks/useApi';
import { SessionForm } from '../components/SessionForm';
import { QRModal } from '../components/QRModal';
import { TopBar } from '../components/TopBar';
import { Card, Badge, Button } from '../components/ui';
import type { CreateSessionRequest, CreateSessionResponse } from '../types';
import './AdminSessions.css';

export const AdminSessions: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading, error } = useSessions();
  const createSession = useCreateSession();
  const deactivateSession = useDeactivateSession();

  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    sessionName: string;
    sessionId: string;
    qrCode: string;
  }>({
    isOpen: false,
    sessionName: '',
    sessionId: '',
    qrCode: '',
  });

  const handleCreateSession = async (data: CreateSessionRequest) => {
    const response: CreateSessionResponse = await createSession.mutateAsync(data);
    // Mostrar QR inmediatamente después de crear
    setQrModal({
      isOpen: true,
      sessionName: response.name,
      sessionId: response.sessionId,
      qrCode: response.qrCode,
    });
  };

  const handleShowQR = async (sessionId: string, sessionName: string) => {
    try {
      // Hacer fetch manual del QR
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/admin/sessions/${sessionId}/qr`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      
      setQrModal({
        isOpen: true,
        sessionName: sessionName,
        sessionId: sessionId,
        qrCode: result.data.qrCode,
      });
    } catch (err) {
      console.error('Error al obtener QR:', err);
    }
  };

  const handleDeactivate = async (sessionId: string) => {
    if (!confirm('¿Estás segura de desactivar esta sesión? No se podrá reactivar.')) {
      return;
    }
    try {
      await deactivateSession.mutateAsync(sessionId);
    } catch (err) {
      console.error('Error al desactivar:', err);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-sessions">
      <TopBar isAdmin={true} />
      <div className="admin-sessions__container">
        <header className="admin-sessions__header">
          <h1 className="admin-sessions__title">Gestión de Sesiones</h1>
          <p className="admin-sessions__subtitle">
            Crea y administra las sesiones de asistencia
          </p>
        </header>

        <div className="admin-sessions__form">
          <SessionForm
            onSubmit={handleCreateSession}
            isLoading={createSession.isPending}
          />
        </div>

        <div className="admin-sessions__list-section">
          <h2 className="admin-sessions__list-title">Sesiones Creadas</h2>

          {isLoading && (
            <div className="admin-sessions__loading">Cargando sesiones...</div>
          )}

          {error && (
            <Card variant="outlined" padding="lg">
              <p className="admin-sessions__error">Error al cargar las sesiones</p>
            </Card>
          )}

          {sessions && sessions.length === 0 && (
            <Card variant="outlined" padding="lg">
              <p className="admin-sessions__empty">
                No hay sesiones creadas aún. Crea tu primera sesión arriba.
              </p>
            </Card>
          )}

          {sessions && sessions.length > 0 && (
            <div className="admin-sessions__list">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  variant="outlined"
                  padding="md"
                  className="admin-sessions__item"
                >
                  <div className="admin-sessions__item-header">
                    <div>
                      <h3 className="admin-sessions__item-name">
                        {session.name}
                      </h3>
                      <p className="admin-sessions__item-id">
                        {session.sessionId}
                      </p>
                    </div>
                    <Badge
                      variant={session.isActive ? 'success' : 'default'}
                      size="sm"
                    >
                      {session.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>

                  <div className="admin-sessions__item-dates">
                    <div className="admin-sessions__item-date">
                      <span className="admin-sessions__item-date-label">
                        Inicio:
                      </span>
                      <span>{formatDateTime(session.startsAt)}</span>
                    </div>
                    <div className="admin-sessions__item-date">
                      <span className="admin-sessions__item-date-label">
                        Fin:
                      </span>
                      <span>{formatDateTime(session.endsAt)}</span>
                    </div>
                  </div>

                  <div className="admin-sessions__item-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleShowQR(session.sessionId, session.name)}
                    >
                      Ver QR
                    </Button>
                    {session.isActive && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDeactivate(session.id)}
                        isLoading={deactivateSession.isPending}
                      >
                        Desactivar
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <QRModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({ ...qrModal, isOpen: false })}
        sessionName={qrModal.sessionName}
        sessionId={qrModal.sessionId}
        qrCode={qrModal.qrCode}
      />
    </div>
  );
};
