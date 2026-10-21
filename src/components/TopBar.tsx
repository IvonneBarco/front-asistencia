import React, { useState } from 'react';
import { NavigationMenu } from './NavigationMenu';
import './TopBar.css';

interface TopBarProps {
  isAdmin?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ isAdmin }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('emaus-sidebar-collapsed') === 'true';
  });

  const handleCollapsedChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem('emaus-sidebar-collapsed', String(collapsed));
  };

  return (
    <aside className={`topbar${isCollapsed ? ' topbar--collapsed' : ''}`}>
      <div className="topbar__container">
        <div className="topbar__logo">
          <span className="topbar__logo-icon">🌸</span>
          <span className="topbar__logo-text">Emaús Mujeres</span>
        </div>
        <NavigationMenu
          isAdmin={isAdmin}
          isCollapsed={isCollapsed}
          onCollapsedChange={handleCollapsedChange}
        />
      </div>
    </aside>
  );
};
