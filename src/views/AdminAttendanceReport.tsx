import React, { useMemo, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Card, Button } from '../components/ui';
import { RankingPodium } from '../components/RankingPodium';
import { RankingProgressList } from '../components/RankingProgressList';
import { useAllGroups, useAttendanceReport } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import './AttendanceRanking.css';
import './AdminAttendanceReport.css';

export const AdminAttendanceReport: React.FC = () => {
  const { user } = useAuth();
  const { data: groups } = useAllGroups();
  const [filters, setFilters] = useState({ from: '', to: '', groupId: '' });
  const { data, isLoading, error } = useAttendanceReport(filters);
  const [search, setSearch] = useState('');

  const filteredEntries = useMemo(
    () => data?.entries.filter((entry) => entry.user.name.toLowerCase().includes(search.toLowerCase())) || [],
    [data, search],
  );

  const exportCsv = () => {
    if (!data) return;
    const escape = (value: string | number | null) => {
      const text = String(value ?? '');
      const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const rows = [
      ['Posición', 'Nombre', 'Grupo', 'Asistencias', 'Participación'],
      ...filteredEntries.map((entry) => [
        entry.rank,
        entry.user.name,
        entry.user.group?.name || '',
        entry.attendances,
        entry.participation === null ? '' : `${entry.participation}%`,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escape).join(';')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reporte-participacion.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="attendance-ranking admin-attendance-report">
      <TopBar isAdmin={user?.role === 'admin'} />
      <main className="attendance-ranking__container admin-attendance-report__container">
        <header className="attendance-ranking__header">
          <p className="attendance-ranking__eyebrow">Administración</p>
          <h1>Reporte de participación</h1>
          <p>Consulta la constancia de la comunidad con datos reales de asistencia.</p>
        </header>

        <Card variant="elevated" padding="lg" className="admin-attendance-report__filters">
          <label>Desde<input type="date" value={filters.from} onChange={(e) => updateFilter('from', e.target.value)} /></label>
          <label>Hasta<input type="date" value={filters.to} onChange={(e) => updateFilter('to', e.target.value)} /></label>
          <label>Grupo<select value={filters.groupId} onChange={(e) => updateFilter('groupId', e.target.value)}>
            <option value="">Todos los grupos</option>
            {groups?.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select></label>
          <Button variant="ghost" onClick={() => setFilters({ from: '', to: '', groupId: '' })}>Limpiar filtros</Button>
        </Card>

        {isLoading && <p className="attendance-ranking__state">Cargando reporte...</p>}
        {error && <p className="attendance-ranking__state attendance-ranking__state--error">No se pudo cargar el reporte.</p>}
        {data && (
          <>
            <div className="admin-attendance-report__stats">
              <Card padding="md"><span className="admin-attendance-report__stat-icon" aria-hidden="true">👥</span><span>Participantes</span><strong>{data.entries.length}</strong></Card>
              <Card padding="md"><span className="admin-attendance-report__stat-icon" aria-hidden="true">📅</span><span>Encuentros</span><strong>{data.eligibleSessions}</strong></Card>
              <Card padding="md"><span className="admin-attendance-report__stat-icon" aria-hidden="true">✓</span><span>Asistencias</span><strong>{data.totalAttendances}</strong></Card>
              <Card padding="md"><span className="admin-attendance-report__stat-icon" aria-hidden="true">🌸</span><span>Participación global</span><strong>{data.eligibleSessions ? Math.round((data.totalAttendances / (data.entries.length * data.eligibleSessions)) * 10000) / 100 : 0}%</strong></Card>
            </div>
            <RankingPodium entries={data.entries} />
            <Card variant="elevated" padding="lg">
              <div className="admin-attendance-report__list-header">
                <div><h2>Clasificación general</h2><p>Orden de competencia; los empates comparten posición.</p></div>
                <div className="admin-attendance-report__actions">
                  <input type="search" placeholder="Buscar participante" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <Button variant="secondary" onClick={exportCsv}>Exportar CSV</Button>
                </div>
              </div>
              <RankingProgressList entries={filteredEntries} />
            </Card>
            <Card variant="outlined" padding="lg" className="admin-attendance-report__sessions">
              <h2>Asistencia por encuentro</h2>
              {data.sessions.map((session) => {
                const maxAttendances = Math.max(...data.sessions.map((item) => item.attendances), 1);
                return (
                  <div key={session.id} className="admin-attendance-report__session-bar">
                    <span>{session.name}</span>
                    <div><i style={{ width: `${(session.attendances / maxAttendances) * 100}%` }} /></div>
                    <strong>{session.attendances}</strong>
                  </div>
                );
              })}
            </Card>
          </>
        )}
      </main>
    </div>
  );
};
