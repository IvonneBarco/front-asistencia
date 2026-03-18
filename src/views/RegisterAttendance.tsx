import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { TopBar } from '../components/TopBar';
import { Card, Badge, Button } from '../components/ui';
import { ConfirmModal } from '../components/ConfirmModal';
import type { Session, RegisterAttendanceRequest } from '../types';
import './RegisterAttendance.css';

export const RegisterAttendance: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Estado local
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
  const [searchUser, setSearchUser] = useState('');
  const [searchSession, setSearchSession] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    details?: any;
  } | null>(null);

  // Fetch usuarios
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.getAllUsers(),
  });

  // Fetch sesiones
  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: () => apiClient.getAllSessions(),
  });

  // Mutación para registrar asistencias
  const registerMutation = useMutation({
    mutationFn: (data: RegisterAttendanceRequest) =>
      apiClient.registerAttendanceManually(data),
    onSuccess: (response) => {
      setResultMessage({
        type: 'success',
        text: `✅ ${response.message}`,
        details: response,
      });
      setShowResult(true);
      setSelectedSessionIds(new Set());
      
      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      // Auto-ocultar después de 10 segundos
      setTimeout(() => setShowResult(false), 10000);
    },
    onError: (error: Error) => {
      setResultMessage({
        type: 'error',
        text: `❌ Error: ${error.message}`,
      });
      setShowResult(true);
    },
  });

  // Filtrar usuarios
  const filteredUsers = users?.filter((user) =>
    user.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.identification?.toLowerCase().includes(searchUser.toLowerCase())
  ) || [];

  // Filtrar sesiones
  const filteredSessions = sessions?.filter((session) =>
    session.name?.toLowerCase().includes(searchSession.toLowerCase()) ||
    session.sessionId?.toLowerCase().includes(searchSession.toLowerCase())
  ) || [];

  // Obtener usuario seleccionado
  const selectedUser = users?.find((u) => u.id === selectedUserId);

  // Manejar toggle de sesión
  const toggleSession = (sessionId: string) => {
    const newSet = new Set(selectedSessionIds);
    if (newSet.has(sessionId)) {
      newSet.delete(sessionId);
    } else {
      newSet.add(sessionId);
    }
    setSelectedSessionIds(newSet);
  };

  // Manejar registro
  const handleRegister = async () => {
    if (!selectedUserId) {
      alert('Por favor selecciona un usuario');
      return;
    }

    if (selectedSessionIds.size === 0) {
      alert('Por favor selecciona al menos una sesión');
      return;
    }

    // Mostrar modal de confirmación
    setShowConfirmModal(true);
  };

  // Confirmar registro
  const confirmRegister = () => {
    registerMutation.mutate({
      userId: selectedUserId,
      sessionIds: Array.from(selectedSessionIds),
    });
    setShowConfirmModal(false);
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

  const isSessionExpired = (session: Session) => {
    return new Date(session.endsAt) < new Date();
  };

  return (
    <div className="register-attendance">
      <TopBar isAdmin={true} />
      
      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmRegister}
        title="Confirmar Registro"
        message={`¿Registrar ${selectedSessionIds.size} asistencia${selectedSessionIds.size > 1 ? 's' : ''} para ${selectedUser?.name}?`}
        confirmText="Registrar"
        cancelText="Cancelar"
        isLoading={registerMutation.isPending}
      />
      
      <div className="register-attendance__container">
        <header className="register-attendance__header">
          <h1 className="register-attendance__title">Registrar Asistencias Manualmente</h1>
          <p className="register-attendance__subtitle">
            Registra asistencias de usuarios a sesiones desactivadas o vencidas
          </p>
        </header>

        {/* Resultado */}
        {showResult && resultMessage && (
          <Card
            variant="elevated"
            padding="lg"
            className={`register-attendance__result register-attendance__result--${resultMessage.type}`}
          >
            <div className="register-attendance__result-header">
              <p className="register-attendance__result-text">{resultMessage.text}</p>
              <button
                className="register-attendance__result-close"
                onClick={() => setShowResult(false)}
              >
                ✕
              </button>
            </div>
            
            {resultMessage.details && (
              <div className="register-attendance__result-details">
                <div className="register-attendance__result-stats">
                  <span>✅ Registradas: {resultMessage.details.registered}</span>
                  <span>⚠️ Ya existían: {resultMessage.details.alreadyRegistered}</span>
                  <span>🌸 Flores ganadas: +{resultMessage.details.flowersAdded}</span>
                  <span>🌸 Total flores: {resultMessage.details.totalFlowers}</span>
                </div>
                
                {resultMessage.details.details?.registered?.length > 0 && (
                  <div className="register-attendance__result-list">
                    <strong>Sesiones registradas:</strong>
                    <ul>
                      {resultMessage.details.details.registered.map((s: any) => (
                        <li key={s.sessionId}>{s.sessionName}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <div className="register-attendance__content">
          {/* Selector de Usuario */}
          <Card variant="elevated" padding="lg" className="register-attendance__user-section">
            <h2 className="register-attendance__section-title">
              1. Seleccionar Usuario
            </h2>
            
            <input
              type="text"
              placeholder="Buscar por nombre o identificación..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="register-attendance__search"
            />

            {loadingUsers && <p>Cargando usuarios...</p>}

            <div className="register-attendance__user-list">
              {filteredUsers.map((user) => (
                <label
                  key={user.id}
                  className={`register-attendance__user-item ${
                    selectedUserId === user.id ? 'register-attendance__user-item--selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="user"
                    value={user.id}
                    checked={selectedUserId === user.id}
                    onChange={() => setSelectedUserId(user.id)}
                  />
                  <div className="register-attendance__user-info">
                    <strong>{user.name}</strong>
                    <span className="register-attendance__user-id">{user.identification}</span>
                    <Badge variant="info">{user.flowers} 🌸</Badge>
                  </div>
                </label>
              ))}
              
              {filteredUsers.length === 0 && !loadingUsers && (
                <p className="register-attendance__empty">No se encontraron usuarios</p>
              )}
            </div>
          </Card>

          {/* Selector de Sesiones */}
          <Card variant="elevated" padding="lg" className="register-attendance__sessions-section">
            <h2 className="register-attendance__section-title">
              2. Seleccionar Sesiones ({selectedSessionIds.size} seleccionadas)
            </h2>

            <input
              type="text"
              placeholder="Buscar sesión..."
              value={searchSession}
              onChange={(e) => setSearchSession(e.target.value)}
              className="register-attendance__search"
            />

            {loadingSessions && <p>Cargando sesiones...</p>}

            <div className="register-attendance__sessions-list">
              {filteredSessions.map((session) => {
                const isExpired = isSessionExpired(session);
                const isChecked = selectedSessionIds.has(session.id);

                return (
                  <label
                    key={session.id}
                    className={`register-attendance__session-item ${
                      isChecked ? 'register-attendance__session-item--selected' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSession(session.id)}
                    />
                    <div className="register-attendance__session-info">
                      <strong>{session.name}</strong>
                      <span className="register-attendance__session-date">
                        {formatDateTime(session.startsAt)}
                      </span>
                      <div className="register-attendance__session-badges">
                        {!session.isActive && (
                          <Badge variant="warning">Desactivada</Badge>
                        )}
                        {isExpired && (
                          <Badge variant="error">Vencida</Badge>
                        )}
                        {session.isActive && !isExpired && (
                          <Badge variant="success">Activa</Badge>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}

              {filteredSessions.length === 0 && !loadingSessions && (
                <p className="register-attendance__empty">No se encontraron sesiones</p>
              )}
            </div>
          </Card>
        </div>

        {/* Botón de Registro */}
        <div className="register-attendance__actions">
          <Card variant="elevated" padding="lg">
            <div className="register-attendance__summary">
              <div className="register-attendance__summary-info">
                {selectedUser ? (
                  <>
                    <strong>Usuario:</strong> {selectedUser.name}
                    <br />
                    <strong>Sesiones:</strong> {selectedSessionIds.size}
                  </>
                ) : (
                  <span className="register-attendance__summary-empty">
                    Selecciona un usuario y al menos una sesión
                  </span>
                )}
              </div>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleRegister}
                disabled={!selectedUserId || selectedSessionIds.size === 0 || registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Registrando...' : 'Registrar Asistencias'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
