import React, { useState } from 'react';
import {
  useAllGroups,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
} from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { TopBar } from '../components/TopBar';
import { Card, Badge, Button } from '../components/ui';
import type { Group, CreateGroupRequest, UpdateGroupRequest } from '../types';
import './AdminGroups.css';

export const AdminGroups: React.FC = () => {
  const { user } = useAuth();
  const { data: groupsData, isLoading, error } = useAllGroups();
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [viewingMembers, setViewingMembers] = useState<Group | null>(null);
  const [formData, setFormData] = useState<CreateGroupRequest>({
    name: '',
    isActive: true,
  });

  const groups = Array.isArray(groupsData) ? groupsData : [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup.mutateAsync(formData);
      setFormData({ name: '', isActive: true });
      setShowCreateForm(false);
    } catch (error) {
      // Error manejado por el componente
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    const updateData: UpdateGroupRequest = {
      name: formData.name,
      isActive: formData.isActive,
    };

    try {
      await updateGroup.mutateAsync({
        groupId: editingGroup.id,
        data: updateData,
      });
      setEditingGroup(null);
      setFormData({ name: '', isActive: true });
    } catch (error) {
      // Error manejado por el componente
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({ name: group.name, isActive: group.isActive });
    setShowCreateForm(false);
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setFormData({ name: '', isActive: true });
  };

  const handleToggleActive = async (group: Group) => {
    try {
      await updateGroup.mutateAsync({
        groupId: group.id,
        data: { isActive: !group.isActive },
      });
    } catch (error) {
      // Error manejado por el componente
    }
  };

  if (isLoading) {
    return (
      <div className="admin-groups">
        <TopBar isAdmin={user?.role === 'admin'} />
        <div className="admin-groups__container">
          <div className="admin-groups__loading">Cargando grupos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-groups">
        <TopBar isAdmin={user?.role === 'admin'} />
        <div className="admin-groups__container">
          <Card variant="elevated" padding="lg">
            <p className="admin-groups__error">Error al cargar grupos</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-groups">
      <TopBar isAdmin={user?.role === 'admin'} />
      <div className="admin-groups__container">
        <header className="admin-groups__header">
          <div>
            <h1 className="admin-groups__title">Gestión de Grupos</h1>
            <p className="admin-groups__subtitle">
              Administra los grupos de trabajo de la comunidad
            </p>
          </div>
          {!showCreateForm && !editingGroup && (
            <Button
              variant="primary"
              onClick={() => setShowCreateForm(true)}
            >
              + Crear Grupo
            </Button>
          )}
        </header>

        {(showCreateForm || editingGroup) && (
          <Card variant="elevated" padding="lg" className="admin-groups__form-card">
            <form
              onSubmit={editingGroup ? handleUpdateSubmit : handleCreateSubmit}
              className="admin-groups__form"
            >
              <h3 className="admin-groups__form-title">
                {editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
              </h3>

              <div className="admin-groups__form-field">
                <label htmlFor="name" className="admin-groups__form-label">
                  Nombre del grupo
                </label>
                <input
                  id="name"
                  type="text"
                  className="admin-groups__form-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Grupo 1"
                  required
                />
              </div>

              <div className="admin-groups__form-checkbox">
                <label className="admin-groups__checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span>Grupo activo</span>
                </label>
              </div>

              {(createGroup.isError || updateGroup.isError) && (
                <div className="admin-groups__error">
                  {createGroup.error instanceof Error
                    ? createGroup.error.message
                    : updateGroup.error instanceof Error
                    ? updateGroup.error.message
                    : 'Error al procesar la solicitud'}
                </div>
              )}

              <div className="admin-groups__form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    handleCancelEdit();
                  }}
                  disabled={createGroup.isPending || updateGroup.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={createGroup.isPending || updateGroup.isPending}
                  disabled={createGroup.isPending || updateGroup.isPending}
                >
                  {editingGroup ? 'Guardar Cambios' : 'Crear Grupo'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="admin-groups__list-section">
          <h3 className="admin-groups__list-title">
            Grupos ({groups.length})
          </h3>

          {groups.length === 0 ? (
            <Card variant="outlined" padding="lg">
              <p className="admin-groups__empty">
                No hay grupos creados. Crea el primero para comenzar.
              </p>
            </Card>
          ) : (
            <div className="admin-groups__list">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  variant="outlined"
                  padding="lg"
                  className="admin-groups__item"
                >
                  <div className="admin-groups__item-header">
                    <div className="admin-groups__item-info">
                      <h4 className="admin-groups__item-name">{group.name}</h4>
                      <div className="admin-groups__item-badges">
                        <Badge
                          variant={group.isActive ? 'success' : 'default'}
                          size="sm"
                        >
                          {group.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge 
                          variant="default" 
                          size="sm"
                          style={{ cursor: group.memberCount > 0 ? 'pointer' : 'default' }}
                          onClick={() => group.memberCount > 0 && setViewingMembers(group)}
                        >
                          {group.memberCount}{' '}
                          {group.memberCount === 1 ? 'integrante' : 'integrantes'}
                        </Badge>
                      </div>
                    </div>
                    <div className="admin-groups__item-actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(group)}
                        disabled={
                          editingGroup?.id === group.id ||
                          updateGroup.isPending ||
                          deleteGroup.isPending
                        }
                      >
                        Editar
                      </Button>
                      <Button
                        variant={group.isActive ? 'ghost' : 'secondary'}
                        size="sm"
                        onClick={() => handleToggleActive(group)}
                        disabled={updateGroup.isPending || deleteGroup.isPending}
                      >
                        {group.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {viewingMembers && (
          <div className="admin-groups__modal-overlay" onClick={() => setViewingMembers(null)}>
            <Card 
              variant="elevated" 
              padding="lg" 
              className="admin-groups__modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-groups__modal-header">
                <h3 className="admin-groups__modal-title">
                  Integrantes de {viewingMembers.name}
                </h3>
                <button
                  className="admin-groups__modal-close"
                  onClick={() => setViewingMembers(null)}
                >
                  ✕
                </button>
              </div>
              
              {viewingMembers.users && viewingMembers.users.length > 0 ? (
                <div className="admin-groups__members-list">
                  {viewingMembers.users.map((user) => (
                    <div key={user.id} className="admin-groups__member-item">
                      <div className="admin-groups__member-info">
                        <p className="admin-groups__member-name">{user.name}</p>
                      </div>
                      <div className="admin-groups__member-stats">
                        <Badge variant="warning" size="sm">
                          {user.flowers} 🌸
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-groups__empty">No hay integrantes en este grupo.</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
