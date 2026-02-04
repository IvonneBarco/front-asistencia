import React from 'react';
import { NavigationMenu } from './NavigationMenu';
import './TopBar.css';

interface TopBarProps {
  isAdmin?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ isAdmin }) => {
  return (
    <div className="topbar">
      <div className="topbar__container">
        <div className="topbar__logo">
          <span className="topbar__logo-icon">🌸</span>
          <span className="topbar__logo-text">Emaús</span>
        </div>
        <NavigationMenu isAdmin={isAdmin} />
      </div>
    </div>
  );
};
