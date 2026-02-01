import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !pin) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, pin });
      navigate('/scanner');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al iniciar sesión'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__header">
          <div className="login__logo">
            {/* Logo: cruz + mariposa */}
            <div className="login__logo-icon">✝️🦋</div>
          </div>
          <h1 className="login__title">Emaús Mujeres</h1>
          <p className="login__subtitle">
            Bienvenida. Ingresa para registrar tu asistencia.
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit} className="login__form">
            <div className="login__field">
              <label htmlFor="email" className="login__label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login__input"
                placeholder="tu@correo.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="login__field">
              <label htmlFor="pin" className="login__label">
                PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="login__input"
                placeholder="••••"
                inputMode="numeric"
                maxLength={4}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="login__error" role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Ingresar
            </Button>
          </form>
        </Card>

        <p className="login__footer">
          Tu presencia y constancia son un regalo para la comunidad 🌸
        </p>
      </div>
    </div>
  );
};
