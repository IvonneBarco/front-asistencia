import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui';
import './NavigationMenu.css';

interface NavigationMenuProps {
  isAdmin?: boolean;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isAdmin,
  isCollapsed,
  onCollapsedChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;

  const renderItem = (path: string, icon: string, label: string) => (
    <button
      className={`nav-menu__item${isActive(path) ? ' nav-menu__item--active' : ''}`}
      onClick={() => handleNavigate(path)}
      title={isCollapsed ? label : undefined}
      aria-current={isActive(path) ? 'page' : undefined}
    >
      <span className="nav-menu__icon" aria-hidden="true">{icon}</span>
      <span className="nav-menu__label">{label}</span>
    </button>
  );

  return (
    <div className="nav-menu" ref={menuRef}>
      <div className="nav-menu__header">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
              onCollapsedChange(!isCollapsed);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className="nav-menu__trigger"
          aria-label="Abrir menú o alternar navegación"
          aria-expanded={isOpen}
        >
          <span className="nav-menu__mobile-trigger-icon" aria-hidden="true">☰</span>
          <span className="nav-menu__desktop-trigger-icon" aria-hidden="true">
            {isCollapsed ? '→' : '←'}
          </span>
        </Button>
      </div>

      <div className={`nav-menu__dropdown${isOpen ? ' nav-menu__dropdown--open' : ''}`}>
        <div className="nav-menu__scroll-area">
          <div className="nav-menu__section-label">Comunidad</div>
          {renderItem('/jardin', '🌸', 'Jardín')}
          {renderItem('/my-group', '👥', 'Mi Grupo')}
          {renderItem('/ranking', '🦋', 'Caminando juntas')}
          <div className="nav-menu__section-label">General</div>
          {renderItem('/profile', '👤', 'Mi perfil')}
          <a
            className="nav-menu__item"
            href="https://ivonnebarco.github.io/biblioteca-emaus-la-catedral/"
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
            title={isCollapsed ? 'Biblioteca' : undefined}
            aria-label="Biblioteca"
          >
            <span className="nav-menu__icon" aria-hidden="true">📚</span>
            <span className="nav-menu__label">Biblioteca</span>
          </a>
          {isAdmin && (
            <>
              <div className="nav-menu__section-label">Administración</div>
              {renderItem('/admin/sessions', '📅', 'Sesiones')}
              {renderItem('/admin/users', '👥', 'Usuarios')}
              {renderItem('/admin/groups', '🎯', 'Grupos')}
              {renderItem('/admin/register-attendance', '✏️', 'Registrar asistencias')}
              {renderItem('/admin/saint-loans', '✦', 'Préstamos de santos')}
              {renderItem('/admin/attendance-report', '📊', 'Reporte de participación')}
            </>
          )}
        </div>
        <div className="nav-menu__footer">
          <button
            className="nav-menu__item nav-menu__item--logout"
            onClick={() => {
              logout();
              navigate('/login');
              setIsOpen(false);
            }}
            title={isCollapsed ? 'Cerrar sesión' : undefined}
            aria-label="Cerrar sesión"
          >
            <span className="nav-menu__icon" aria-hidden="true">🚪</span>
            <span className="nav-menu__label">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
