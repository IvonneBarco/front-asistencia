import React, { useState } from 'react';
import { useGroups, useAssignUserGroup } from '../hooks/useApi';
import { Button, Badge } from './ui';
import type { User } from '../types';
import './GroupAssignModal.css';

interface GroupAssignModalProps {
  user: User;
  onClose: () => void;
}

export const GroupAssignModal: React.FC<GroupAssignModalProps> = ({
  user,
  onClose,
}) => {
  const { data: groupsData, isLoading: loadingGroups } = useGroups();
  const assignGroup = useAssignUserGroup();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    user.group?.id || null
  );
  const [reason, setReason] = useState('');

  const groups = Array.isArray(groupsData) ? groupsData : [];

  const handleAssign = async () => {
    if (selectedGroupId) {
      try {
        await assignGroup.mutateAsync({
          userId: user.id,
          groupId: selectedGroupId,
          ...(reason && { reason }),
        });
        onClose();
      } catch (error) {
        // Error manejado por el componente
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="group-assign-modal" onClick={handleBackdropClick}>
      <div className="group-assign-modal__content">
        <div className="group-assign-modal__header">
          <h3 className="group-assign-modal__title">
            Asignar Grupo de Trabajo
          </h3>
          <button
            className="group-assign-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="group-assign-modal__body">
          <div className="group-assign-modal__user">
            <p className="group-assign-modal__user-name">{user.name}</p>
            {user.group && (
              <Badge variant="default" size="sm">
                Grupo actual: {user.group.name}
              </Badge>
            )}
          </div>

          {loadingGroups ? (
            <div className="group-assign-modal__loading">
              Cargando grupos...
            </div>
          ) : (
            <div className="group-assign-modal__groups">
              <label className="group-assign-modal__label">
                Selecciona un grupo:
              </label>
              <div className="group-assign-modal__options">
                {groups.map((group) => (
                  <label
                    key={group.id}
                    className={`group-assign-modal__option ${
                      selectedGroupId === group.id
                        ? 'group-assign-modal__option--selected'
                        : ''
                    } ${
                      !group.isActive
                        ? 'group-assign-modal__option--disabled'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="group"
                      value={group.id}
                      checked={selectedGroupId === group.id}
                      onChange={() => setSelectedGroupId(group.id)}
                      disabled={!group.isActive}
                      className="group-assign-modal__radio"
                    />
                    <div className="group-assign-modal__option-content">
                      <span className="group-assign-modal__option-name">
                        {group.name}
                      </span>
                      <span className="group-assign-modal__option-count">
                        {group.memberCount}{' '}
                        {group.memberCount === 1 ? 'integrante' : 'integrantes'}
                      </span>
                      {!group.isActive && (
                        <Badge variant="default" size="sm">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="group-assign-modal__reason">
            <label className="group-assign-modal__label">
              Razón del cambio (opcional):
            </label>
            <textarea
              className="group-assign-modal__textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ejemplo: Cambio de equipo de trabajo"
              rows={3}
            />
          </div>

          {assignGroup.isError && (
            <div className="group-assign-modal__error">
              {assignGroup.error instanceof Error
                ? assignGroup.error.message
                : 'Error al asignar grupo. Por favor intenta de nuevo.'}
            </div>
          )}
        </div>

        <div className="group-assign-modal__footer">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={assignGroup.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            isLoading={assignGroup.isPending}
            disabled={!selectedGroupId || assignGroup.isPending}
          >
            Asignar Grupo
          </Button>
        </div>
      </div>
    </div>
  );
};
