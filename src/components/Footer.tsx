import React from 'react';
import './Footer.css';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__version">{APP_VERSION}</div>
  </footer>
);
