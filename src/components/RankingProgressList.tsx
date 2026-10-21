import React from 'react';
import type { LeaderboardEntry } from '../types';
import './Ranking.css';

interface RankingProgressListProps {
  entries: LeaderboardEntry[];
}

export const RankingProgressList: React.FC<RankingProgressListProps> = ({ entries }) => (
  <div className="ranking-list">
    {entries.map((entry) => (
      <div
        key={entry.user.id}
        className={`ranking-list__row${entry.isCurrentUser ? ' ranking-list__row--current' : ''}`}
      >
        <span className="ranking-list__rank">#{entry.rank}</span>
        <div className="ranking-list__identity">
          <strong>{entry.user.name}</strong>
          {entry.user.group && <span>{entry.user.group.name}</span>}
          <div className="ranking-list__track" aria-label={`${entry.participation ?? entry.attendances}%`}>
            <span style={{ width: `${Math.min(entry.participation ?? 0, 100)}%` }} />
          </div>
        </div>
        <span className="ranking-list__total">
          {entry.attendances} <small>asist.</small>
        </span>
      </div>
    ))}
  </div>
);
