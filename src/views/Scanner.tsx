import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAttendanceScan } from '../hooks/useApi';
import { Card, Button, Badge } from '../components/ui';
import { TopBar } from '../components/TopBar';
import './Scanner.css';

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error' | 'duplicate';

interface ScanResult {
  message: string;
  flowers?: number;
}

export const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: scanAttendance } = useAttendanceScan();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);
  const isProcessingRef = useRef(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    return () => {
      // Cleanup al desmontar el componente
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  const startScanner = async () => {
    if (isScanning || scannerRef.current) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;
      setIsScanning(true);
      setStatus('scanning');
      isProcessingRef.current = false;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Detener inmediatamente el scanner cuando se detecta un QR
          if (!isProcessingRef.current) {
            isProcessingRef.current = true;
            handleScan(decodedText);
          }
        },
        undefined
      );
    } catch (err) {
      console.error('Error iniciando escáner:', err);
      setStatus('error');
      setResult({
        message: 'No se pudo acceder a la cámara. Verifica los permisos.',
      });
      setIsScanning(false);
      scannerRef.current = null;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error deteniendo escáner:', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const handleCancel = async () => {
    await stopScanner();
    navigate('/jardin');
  };

  const handleScan = async (qrCode: string) => {
    // Detener el scanner PRIMERO
    await stopScanner();

    try {
      const response = await scanAttendance({ qrCode });

      // Considerar exitoso si added es true
      if (response.added) {
        setStatus('success');
        setResult({
          message: response.message,
          flowers: response.flowers,
        });
      } else {
        setStatus('duplicate');
        setResult({ message: response.message });
      }
    } catch (error) {
      setStatus('error');
      setResult({
        message:
          error instanceof Error
            ? error.message
            : 'Código inválido o vencido',
      });
    }
  };

  const handleReset = async () => {
    await stopScanner();
    setStatus('idle');
    setResult(null);
    isProcessingRef.current = false;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return '🌸';
      case 'error':
        return '❌';
      case 'duplicate':
        return '⚠️';
      default:
        return '📷';
    }
  };

  const getStatusColor = (): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'duplicate':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="scanner">
      <TopBar isAdmin={isAdmin} />
      <div className="scanner__container">
        <header className="scanner__header">
          <h1 className="scanner__title">Registrar Asistencia</h1>
          <p className="scanner__subtitle">
            Escanea el código QR de la sesión
          </p>
        </header>

        <Card variant="elevated" padding="lg" className="scanner__card">
          {/* Elemento QR siempre presente (requerido por Html5Qrcode) */}
          <div 
            id="qr-reader" 
            ref={qrReaderRef} 
            className="scanner__video"
            style={{ display: status === 'scanning' ? 'block' : 'none' }}
          />

          {status === 'idle' && (
            <div className="scanner__idle">
              <div className="scanner__icon">{getStatusIcon()}</div>
              <p className="scanner__message">
                Presiona el botón para activar la cámara
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={startScanner}
              >
                Activar Cámara
              </Button>
            </div>
          )}

          {status === 'scanning' && (
            <div className="scanner__active">
              <p className="scanner__hint">
                Centra el código QR en el recuadro
              </p>
              <Button variant="secondary" fullWidth onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          )}

          {(status === 'success' || status === 'error' || status === 'duplicate') && (
            <div className="scanner__result">
              {status === 'success' ? (
                <>
                  <div className="scanner__success-container">
                    <div className="scanner__success-icon">🌸</div>
                    <h3 className="scanner__success-title">¡Asistencia Registrada!</h3>
                    {result?.flowers && (
                      <div className="scanner__flores-badge">
                        <span className="scanner__flores-number">+{result.flowers}</span>
                        <span className="scanner__flores-text">flor{result.flowers > 1 ? 'es' : ''}</span>
                      </div>
                    )}
                    {result?.message && (
                      <p className="scanner__success-message">{result.message}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="scanner__icon">{getStatusIcon()}</div>
                  <Badge variant={getStatusColor()} size="lg">
                    {result?.message}
                  </Badge>
                </>
              )}
              <div className="scanner__actions">
                <Button variant="secondary" fullWidth onClick={handleReset}>
                  Escanear Otra
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => navigate('/jardin')}
                >
                  Ver Jardín de Emaús
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
