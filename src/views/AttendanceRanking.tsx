import React from 'react';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/ui';
import { RankingPodium } from '../components/RankingPodium';
import { RankingProgressList } from '../components/RankingProgressList';
import { useLeaderboard } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import './AttendanceRanking.css';

export const AttendanceRanking: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useLeaderboard();

  return (
    <div className="attendance-ranking">
      <TopBar isAdmin={user?.role === 'admin'} />
      <main className="attendance-ranking__container">
        <header className="attendance-ranking__header">
          <p className="attendance-ranking__eyebrow">🦋 Comunidad Emaús</p>
          <h1>Caminando juntas en la fe</h1>
          <p>Cada encuentro es una oportunidad para crecer en comunidad.</p>
        </header>
        {isLoading && <p className="attendance-ranking__state">Cargando clasificación...</p>}
        {error && <p className="attendance-ranking__state attendance-ranking__state--error">No se pudo cargar la clasificación.</p>}
        {data && (
          <>
            <RankingPodium entries={data.entries} />
            <Card variant="elevated" padding="lg" className="attendance-ranking__card">
              <h2>Clasificación general</h2>
              <p className="attendance-ranking__hint">{data.eligibleSessions} encuentros considerados</p>
              <RankingProgressList entries={data.entries} />
            </Card>
            {data.currentUser && (
              <Card variant="outlined" padding="lg" className="attendance-ranking__personal">
                <h2>Mi participación</h2>
                <strong>Posición #{data.currentUser.rank}</strong>
                <span>{data.currentUser.attendances} asistencias{data.currentUser.participation !== null ? ` · ${data.currentUser.participation}%` : ''}</span>
                <p>Gracias por caminar y perseverar junto a nuestra comunidad.</p>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};
