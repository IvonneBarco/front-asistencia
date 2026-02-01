import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useAttendanceScan } from '../hooks/useApi';
import { Card, Button, Badge } from '../components/ui';
import './Scanner.css';

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error' | 'duplicate';

interface ScanResult {
  message: string;
  flores?: number;
}

export const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: scanAttendance, isPending } = useAttendanceScan();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!qrReaderRef.current || isScanning) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;
      setIsScanning(true);
      setStatus('scanning');

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await handleScan(decodedText);
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
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error deteniendo escáner:', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const handleScan = async (qrCode: string) => {
    if (isPending) return;

    await stopScanner();

    try {
      const response = await scanAttendance({ qrCode });

      if (response.success) {
        setStatus('success');
        setResult({
          message: response.message,
          flores: response.flores,
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

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
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
      <div className="scanner__container">
        <header className="scanner__header">
          <h1 className="scanner__title">Registrar Asistencia</h1>
          <p className="scanner__subtitle">
            Escanea el código QR de la sesión
          </p>
        </header>

        <Card variant="elevated" padding="lg" className="scanner__card">
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
              <div id="qr-reader" ref={qrReaderRef} className="scanner__video" />
              <p className="scanner__hint">
                Centra el código QR en el recuadro
              </p>
              <Button variant="secondary" fullWidth onClick={stopScanner}>
                Cancelar
              </Button>
            </div>
          )}

          {(status === 'success' || status === 'error' || status === 'duplicate') && (
            <div className="scanner__result">
              <div className="scanner__icon">{getStatusIcon()}</div>
              <Badge variant={getStatusColor()} size="lg">
                {result?.message}
              </Badge>
              {status === 'success' && result?.flores && (
                <p className="scanner__flores">+{result.flores} flor{result.flores > 1 ? 'es' : ''} 🌸</p>
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
