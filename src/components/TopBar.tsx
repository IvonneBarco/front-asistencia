import React from 'react';
import { NavigationMenu } from './NavigationMenu';
import './TopBar.css';

interface TopBarProps {
  isAdmin?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ isAdmin }) => {
  const APP_VERSION = import.meta.env.VITE_APP_VERSION;
  return (
    <div className="topbar">
      <div className="topbar__container">
        <div className="topbar__logo">
          <span className="topbar__logo-icon">🌸</span>
          <span className="topbar__logo-text">Emaús</span>
        </div>
        <NavigationMenu isAdmin={isAdmin} />
        <div className="topbar__version" style={{ fontSize: '0.75rem', color: '#6B3A1E', marginLeft: 'auto', paddingRight: '1rem' }}>
          v: {APP_VERSION}
        </div>
      </div>
    </div>
  );
};
