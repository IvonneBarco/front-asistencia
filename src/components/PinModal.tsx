import React, { useEffect, useRef, useCallback } from 'react';
import { Card, Button } from './ui';
import './PinModal.css';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, children, title }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Forzar reflow del modal cuando el teclado virtual cambia el viewport
  const handleViewportResize = useCallback(() => {
    if (backdropRef.current) {
      // Forzar scroll al contenido visible
      const modal = backdropRef.current.querySelector('.pin-modal__content') as HTMLElement;
      if (modal) {
        modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Escuchar cambios del viewport visual (teclado virtual)
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportResize);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    };
  }, [isOpen, handleViewportResize]);

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
    <div className="pin-modal__backdrop" ref={backdropRef} onClick={onClose}>
      <div className="pin-modal__content" onClick={e => e.stopPropagation()}>
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
