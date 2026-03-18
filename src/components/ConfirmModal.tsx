import React, { useEffect } from 'react';
import { Button, Card } from './ui';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Scroll al inicio cuando se abre el modal
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={isLoading ? undefined : onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <Card variant="elevated" padding="lg">
          <div className="confirm-modal__content">
            <div className="confirm-modal__header">
              <h2 className="confirm-modal__title">{title}</h2>
              <button
                onClick={onClose}
                className="confirm-modal__close"
                aria-label="Cerrar"
                disabled={isLoading}
              >
                ✕
              </button>
            </div>

            <div className="confirm-modal__icon">
              ✏️
            </div>

            <div className="confirm-modal__message">
              <p>{message}</p>
            </div>

            <div className="confirm-modal__actions">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : confirmText}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
