import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaderboard } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button } from '../components/ui';
import './Jardin.css';

export const Jardin: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useLeaderboard();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="jardin">
        <div className="jardin__container">
          <div className="jardin__loading">Cargando jardín...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jardin">
        <div className="jardin__container">
          <Card variant="elevated" padding="lg">
            <p className="jardin__error">Error al cargar el jardín</p>
            <Button variant="secondary" fullWidth onClick={() => navigate('/scanner')}>
              Volver
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentUserEntry = data?.currentUser || data?.entries.find(
    (entry) => entry.user.id === user?.id
  );

  return (
    <div className="jardin">
      <div className="jardin__container">
        <header className="jardin__header">
          <h1 className="jardin__title">Jardín de Emaús</h1>
          <p className="jardin__subtitle">
            Reconocimiento a la constancia y presencia de nuestra comunidad
          </p>
        </header>

        {currentUserEntry && (
          <Card variant="elevated" padding="lg" className="jardin__current-user">
            <div className="jardin__current-user-content">
              <div className="jardin__current-user-info">
                <p className="jardin__current-user-label">Tu posición</p>
                <h2 className="jardin__current-user-name">
                  {currentUserEntry.user.name}
                </h2>
              </div>
              <div className="jardin__current-user-stats">
                <Badge variant="success" size="lg">
                  #{currentUserEntry.rank}
                </Badge>
                <div className="jardin__flores-badge">
                  <span className="jardin__flores-count">
                    {currentUserEntry.flores}
                  </span>
                  <span className="jardin__flores-icon">🌸</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="jardin__list-header">
          <h3 className="jardin__list-title">Orden de Flores</h3>
          <p className="jardin__list-subtitle">
            Celebramos a cada hermana por su compromiso
          </p>
        </div>

        <div className="jardin__list">
          {data?.entries.map((entry) => (
            <Card
              key={entry.user.id}
              variant={entry.isCurrentUser ? 'outlined' : 'default'}
              padding="md"
              className="jardin__entry"
            >
              <div className="jardin__entry-rank">
                {entry.rank <= 3 ? (
                  <span className="jardin__medal">
                    {entry.rank === 1 && '🥇'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                  </span>
                ) : (
                  <span className="jardin__rank-number">#{entry.rank}</span>
                )}
              </div>
              <div className="jardin__entry-info">
                <h4 className="jardin__entry-name">{entry.user.name}</h4>
                {entry.isCurrentUser && (
                  <span className="jardin__entry-badge-text">Tú</span>
                )}
              </div>
              <div className="jardin__entry-flores">
                <span className="jardin__entry-flores-count">
                  {entry.flores}
                </span>
                <span className="jardin__entry-flores-icon">🌸</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="jardin__actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/scanner')}
          >
            Registrar Asistencia
          </Button>
          <Button variant="ghost" fullWidth onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};
