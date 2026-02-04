import React, { useEffect } from 'react';
import { Button, Card } from './ui';
import './QRModal.css';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionName: string;
  sessionId: string;
  qrCode: string;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  sessionName,
  sessionId,
  qrCode,
}) => {
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${sessionId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${sessionName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 2rem;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            h1 {
              font-size: 1.5rem;
              margin-bottom: 1rem;
              text-align: center;
            }
            img {
              max-width: 400px;
              height: auto;
            }
            .session-id {
              margin-top: 1rem;
              font-size: 0.875rem;
              color: #666;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${sessionName}</h1>
          <img src="${qrCode}" alt="QR Code" />
          <p class="session-id">ID: ${sessionId}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <Card variant="elevated" padding="lg">
          <div className="qr-modal__content">
            <div className="qr-modal__header">
              <h2 className="qr-modal__title">{sessionName}</h2>
              <button
                onClick={onClose}
                className="qr-modal__close"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="qr-modal__qr">
              <img
                src={qrCode}
                alt={`QR de ${sessionName}`}
                className="qr-modal__image"
              />
            </div>

            <div className="qr-modal__info">
              <p className="qr-modal__session-id">ID: {sessionId}</p>
            </div>

            <div className="qr-modal__actions">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleDownload}
              >
                Descargar QR
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handlePrint}
              >
                Imprimir
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
