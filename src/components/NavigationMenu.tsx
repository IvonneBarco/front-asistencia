import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui';
import './NavigationMenu.css';

interface NavigationMenuProps {
  isAdmin?: boolean;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ isAdmin }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="nav-menu" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="nav-menu__trigger"
      >
        ☰
      </Button>

      {isOpen && (
        <div className="nav-menu__dropdown">
          {/* <button
            className="nav-menu__item"
            onClick={() => handleNavigate('/scanner')}
          >
            📷 Escanear
          </button> */}
          <button
            className="nav-menu__item"
            onClick={() => handleNavigate('/jardin')}
          >
            🌸 Jardín
          </button>
          <button
            className="nav-menu__item"
            onClick={() => handleNavigate('/my-group')}
          >
            👥 Mi Grupo
          </button>
          {isAdmin && (
            <>
              <div className="nav-menu__divider" />
              <button
                className="nav-menu__item"
                onClick={() => handleNavigate('/admin/sessions')}
              >
                📅 Sesiones
              </button>
              <button
                className="nav-menu__item"
                onClick={() => handleNavigate('/admin/users')}
              >
                👥 Usuarios
              </button>
              <button
                className="nav-menu__item"
                onClick={() => handleNavigate('/admin/groups')}
              >
                🎯 Grupos
              </button>
              <button
                className="nav-menu__item"
                onClick={() => handleNavigate('/admin/register-attendance')}
              >
                ✏️ Registrar Asistencias
              </button>
            </>
          )}
          <div className="nav-menu__divider" />
          <button
            className="nav-menu__item nav-menu__item--logout"
            onClick={() => {
              logout();
              navigate('/login');
              setIsOpen(false);
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};
