import React, { useState } from 'react';
import { useMyGroup, useGroups, useJoinGroup } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { TopBar } from '../components/TopBar';
import { Card, Button, Badge } from '../components/ui';
import './MyGroup.css';

export const MyGroup: React.FC = () => {
  const { user } = useAuth();
  const { data: myGroupData, isLoading: loadingMyGroup } = useMyGroup();
  const { data: groupsData, isLoading: loadingGroups } = useGroups();
  const joinGroup = useJoinGroup();
  
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const hasGroup = myGroupData?.hasGroup !== false && !!myGroupData?.group;
  const groups = Array.isArray(groupsData) ? groupsData : [];

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowConfirmation(true);
  };

  const handleConfirmJoin = async () => {
    if (selectedGroupId) {
      try {
        await joinGroup.mutateAsync({ groupId: selectedGroupId });
        setShowConfirmation(false);
      } catch (error) {
        // Error manejado por el componente
      }
    }
  };

  const handleCancelJoin = () => {
    setShowConfirmation(false);
    setSelectedGroupId(null);
  };

  if (loadingMyGroup || loadingGroups) {
    return (
      <div className="my-group">
        <TopBar isAdmin={user?.role === 'admin'} />
        <div className="my-group__container">
          <div className="my-group__loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-group">
      <TopBar isAdmin={user?.role === 'admin'} />
      <div className="my-group__container">
        <header className="my-group__header">
          <h1 className="my-group__title">Mi Grupo de Trabajo</h1>
          <p className="my-group__subtitle">
            Los grupos nos ayudan a organizarnos y servir mejor a la comunidad
          </p>
        </header>

        {hasGroup ? (
          <Card variant="elevated" padding="lg" className="my-group__current">
            <div className="my-group__current-content">
              <div className="my-group__current-icon">🫱🏻‍🫲🏻</div>
              <div className="my-group__current-info">
                <Badge variant="success" size="lg">
                  {myGroupData?.group?.name}
                </Badge>
                {myGroupData?.group?.isActive === false && (
                  <Badge variant="default" size="sm" style={{ marginTop: 'var(--spacing-sm)' }}>
                    Grupo inactivo
                  </Badge>
                )}
              </div>
            </div>
            <div className="my-group__current-note">
              <p className="my-group__note-text">
                ℹ️ Si necesitas cambiar de grupo, por favor contacta a una servidora.
              </p>
            </div>
          </Card>
        ) : (
          <>
            {!showConfirmation ? (
              <div className="my-group__selection">
                <Card variant="elevated" padding="lg">
                  <h3 className="my-group__section-title">
                    Selecciona tu Grupo de Trabajo
                  </h3>
                  <p className="my-group__section-subtitle">
                    Una vez elijas un grupo, esta decisión será permanente.
                  </p>

                  <div className="my-group__groups">
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        className="my-group__group-card"
                        onClick={() => handleGroupSelect(group.id)}
                        disabled={!group.isActive || joinGroup.isPending}
                      >
                        <div className="my-group__group-header">
                          <h4 className="my-group__group-name">{group.name}</h4>
                          {!group.isActive && (
                            <Badge variant="default" size="sm">
                              Inactivo
                            </Badge>
                          )}
                        </div>
                        <div className="my-group__group-stats">
                          <span className="my-group__group-count">
                            {group.memberCount} {group.memberCount === 1 ? 'miembro' : 'miembros'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {groups.length === 0 && (
                    <p className="my-group__empty">
                      No hay grupos disponibles en este momento.
                    </p>
                  )}
                </Card>
              </div>
            ) : (
              <Card variant="elevated" padding="lg" className="my-group__confirmation">
                <div className="my-group__confirmation-icon">⚠️</div>
                <h3 className="my-group__confirmation-title">
                  ¿Estás segura de tu elección?
                </h3>
                <p className="my-group__confirmation-text">
                  Estás a punto de unirte a{' '}
                  <strong>
                    {groups.find((g) => g.id === selectedGroupId)?.name}
                  </strong>
                  .
                </p>
                <p className="my-group__confirmation-warning">
                  Una vez te unas a este grupo, no podrás cambiarte por tu cuenta.
                  Solo una servidora podrá hacer cambios posteriores.
                </p>

                {joinGroup.isError && (
                  <div className="my-group__error">
                    {joinGroup.error instanceof Error
                      ? joinGroup.error.message
                      : 'Error al unirse al grupo. Por favor intenta de nuevo.'}
                  </div>
                )}

                <div className="my-group__confirmation-actions">
                  <Button
                    variant="secondary"
                    onClick={handleCancelJoin}
                    disabled={joinGroup.isPending}
                    fullWidth
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmJoin}
                    isLoading={joinGroup.isPending}
                    disabled={joinGroup.isPending}
                    fullWidth
                  >
                    Sí, unirme a este grupo
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};
