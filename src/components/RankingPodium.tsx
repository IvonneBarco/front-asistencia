import React from 'react';
import type { LeaderboardEntry } from '../types';
import './Ranking.css';

interface RankingPodiumProps {
  entries: LeaderboardEntry[];
}

const podium = [
  { rank: 2, medal: '🥈', className: 'ranking-podium__place--second' },
  { rank: 1, medal: '🥇', className: 'ranking-podium__place--first' },
  { rank: 3, medal: '🥉', className: 'ranking-podium__place--third' },
];

export const RankingPodium: React.FC<RankingPodiumProps> = ({ entries }) => {
  const eligibleEntries = entries.filter((entry) => entry.attendances > 0);
  const eligiblePlaces = podium
    .map((place) => ({
      ...place,
      winners: eligibleEntries.filter((entry) => entry.rank === place.rank),
    }))
    .filter((place) => place.winners.length > 0);

  return (
    <div className={`ranking-podium ranking-podium--count-${eligiblePlaces.length}`} aria-label="Primeras posiciones">
      {eligiblePlaces.map((place) => {
        const [representative] = place.winners;
        return (
          <div key={place.rank} className={`ranking-podium__place ${place.className}`}>
            <span className="ranking-podium__medal" aria-hidden="true">{place.medal}</span>
            <div className="ranking-podium__names">
              <strong>{representative.user.name}</strong>
              {place.winners.length > 1 && (
                <details className="ranking-podium__ties">
                  <summary>{place.winners.length} participantes empatadas</summary>
                  <ul>
                    {place.winners.map((entry) => <li key={entry.user.id}>{entry.user.name}</li>)}
                  </ul>
                </details>
              )}
            </div>
            <span className="ranking-podium__count">
              {representative.attendances} asistencia{representative.attendances === 1 ? '' : 's'}
            </span>
            <span className="ranking-podium__rank">#{place.rank}</span>
          </div>
        );
      })}
    </div>
  );
};
