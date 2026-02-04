import React, { useState } from 'react';
import { Card, Button } from './ui';
import type { BulkUserInput } from '../types';
import './BulkUserForm.css';

interface BulkUserFormProps {
  onSubmit: (users: BulkUserInput[]) => void;
  isLoading?: boolean;
}

export const BulkUserForm: React.FC<BulkUserFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [users, setUsers] = useState<BulkUserInput[]>([
    { name: '', email: '', pin: '', role: 'user' },
  ]);

  const handleAddUser = () => {
    setUsers([...users, { name: '', email: '', pin: '', role: 'user' }]);
  };

  const handleRemoveUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleUserChange = (
    index: number,
    field: keyof BulkUserInput,
    value: string
  ) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    setUsers(newUsers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsers = users.filter(
      (u) => u.name && u.email && u.pin && u.role
    );
    if (validUsers.length > 0) {
      onSubmit(validUsers);
    }
  };

  const isFormValid = users.some((u) => u.name && u.email && u.pin && u.role);

  return (
    <form onSubmit={handleSubmit} className="bulk-user-form">
      <div className="bulk-user-form__users">
        {users.map((user, index) => (
          <Card key={index} variant="outlined" padding="md" className="bulk-user-form__card">
            <div className="bulk-user-form__card-header">
              <h4 className="bulk-user-form__card-title">
                Usuario {index + 1}
              </h4>
              {users.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveUser(index)}
                >
                  Eliminar
                </Button>
              )}
            </div>

            <div className="bulk-user-form__fields">
              <div className="bulk-user-form__field">
                <label htmlFor={`name-${index}`} className="bulk-user-form__label">
                  Nombre completo
                </label>
                <input
                  id={`name-${index}`}
                  type="text"
                  className="bulk-user-form__input"
                  value={user.name}
                  onChange={(e) =>
                    handleUserChange(index, 'name', e.target.value)
                  }
                  placeholder="María García"
                  required
                />
              </div>

              <div className="bulk-user-form__field">
                <label htmlFor={`email-${index}`} className="bulk-user-form__label">
                  Correo electrónico
                </label>
                <input
                  id={`email-${index}`}
                  type="email"
                  className="bulk-user-form__input"
                  value={user.email}
                  onChange={(e) =>
                    handleUserChange(index, 'email', e.target.value)
                  }
                  placeholder="maria@emaus.com"
                  required
                />
              </div>

              <div className="bulk-user-form__field">
                <label htmlFor={`pin-${index}`} className="bulk-user-form__label">
                  PIN (4 dígitos)
                </label>
                <input
                  id={`pin-${index}`}
                  type="text"
                  className="bulk-user-form__input"
                  value={user.pin}
                  onChange={(e) =>
                    handleUserChange(index, 'pin', e.target.value)
                  }
                  placeholder="1234"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  required
                />
              </div>

              <div className="bulk-user-form__field">
                <label htmlFor={`role-${index}`} className="bulk-user-form__label">
                  Rol
                </label>
                <select
                  id={`role-${index}`}
                  className="bulk-user-form__select"
                  value={user.role}
                  onChange={(e) =>
                    handleUserChange(
                      index,
                      'role',
                      e.target.value as 'user' | 'admin'
                    )
                  }
                  required
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bulk-user-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddUser}
          disabled={isLoading}
        >
          + Agregar otro usuario
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
        >
          Crear {users.filter((u) => u.name && u.email && u.pin).length}{' '}
          usuario(s)
        </Button>
      </div>
    </form>
  );
};
