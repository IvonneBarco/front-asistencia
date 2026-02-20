import React, { useEffect } from 'react';
import { Card, Button } from './ui';
import './QRModal.css';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="qrmodal__backdrop" onClick={onClose}>
      <div className="qrmodal__modal" onClick={e => e.stopPropagation()}>
        <Card variant="elevated" padding="lg">
          {title && <h2 style={{ marginBottom: 16 }}>{title}</h2>}
          {children}
          <Button variant="secondary" onClick={onClose} style={{ marginTop: 16 }}>
            Cancelar
          </Button>
        </Card>
      </div>
    </div>
  );
};
