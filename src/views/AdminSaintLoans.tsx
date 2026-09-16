import React, { useState } from 'react';
import {
  useGetAllUsers,
  useRegisterSaintLoan,
  useSaintLoanHistory,
  useSessions,
  useSessionSaintLoans,
} from '../hooks/useApi';
import { TopBar } from '../components/TopBar';
import { Badge, Button, Card } from '../components/ui';
import type { SaintName } from '../types';
import { normalizeText } from '../utils/text';
import './AdminSaintLoans.css';

const SAINTS: SaintName[] = ['Rosa Mística', 'Medalla Milagrosa', 'Sagrado Corazón'];

export const AdminSaintLoans: React.FC = () => {
  const { data: sessions = [], isLoading: loadingSessions } = useSessions();
  const { data: users = [] } = useGetAllUsers();
  const { data: history } = useSaintLoanHistory();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Record<SaintName, string>>({
    'Rosa Mística': '',
    'Medalla Milagrosa': '',
    'Sagrado Corazón': '',
  });
  const [userSearches, setUserSearches] = useState<Record<SaintName, string>>({
    'Rosa Mística': '',
    'Medalla Milagrosa': '',
    'Sagrado Corazón': '',
  });
  const [activeUserSearch, setActiveUserSearch] = useState<SaintName | null>(null);
  const sessionLoans = useSessionSaintLoans(selectedSessionId);
  const registerLoan = useRegisterSaintLoan();
  const loans = sessionLoans.data?.loans ?? [];
  const assignedUserIds = new Set(loans.map((loan) => loan.user?.id));

  const handleRegister = async (saint: SaintName) => {
    const userId = selectedUsers[saint];
    if (!selectedSessionId || !userId) return;

    try {
      await registerLoan.mutateAsync({ sessionId: selectedSessionId, data: { userId, saint } });
      setSelectedUsers((current) => ({ ...current, [saint]: '' }));
      setUserSearches((current) => ({ ...current, [saint]: '' }));
    } catch {
      // El mensaje de la mutación se muestra en la pantalla.
    }
  };

  const selectedSession = sessions.find((session) => session.sessionId === selectedSessionId);
  const loanForSaint = (saint: SaintName) => loans.find((loan) => loan.saint === saint);

  return (
    <div className="admin-saint-loans">
      <TopBar isAdmin={true} />
      <main className="admin-saint-loans__container">
        <header className="admin-saint-loans__header">
          <div>
            <p className="admin-saint-loans__eyebrow">Administración</p>
            <h1 className="admin-saint-loans__title">Préstamos de santos</h1>
            <p className="admin-saint-loans__subtitle">Registra quién lleva cada santo durante una sesión.</p>
          </div>
          <div className="admin-saint-loans__capacity" aria-label={`${loans.length} de 3 asignaciones`}>
            <strong>{loans.length}/3</strong>
            <span>puestos ocupados</span>
          </div>
        </header>

        <Card variant="outlined" padding="lg" className="admin-saint-loans__session-card">
          <label htmlFor="loan-session" className="admin-saint-loans__label">Sesión</label>
          <select
            id="loan-session"
            className="admin-saint-loans__select"
            value={selectedSessionId ?? ''}
            onChange={(event) => {
              setSelectedSessionId(event.target.value || null);
              setSelectedUsers({ 'Rosa Mística': '', 'Medalla Milagrosa': '', 'Sagrado Corazón': '' });
              setUserSearches({ 'Rosa Mística': '', 'Medalla Milagrosa': '', 'Sagrado Corazón': '' });
            }}
            disabled={loadingSessions}
          >
            <option value="">Selecciona una sesión</option>
            {sessions.map((session) => (
              <option key={session.sessionId} value={session.sessionId}>{session.name}</option>
            ))}
          </select>
          {selectedSession && <span className="admin-saint-loans__session-meta">{selectedSession.sessionId}</span>}
        </Card>

        {selectedSessionId && (
          <section className="admin-saint-loans__assignments" aria-labelledby="assignments-title">
            <div className="admin-saint-loans__section-heading">
              <div>
                <p className="admin-saint-loans__eyebrow">Sesión seleccionada</p>
                <h2 id="assignments-title">Asignaciones</h2>
              </div>
              <Badge variant={loans.length === 3 ? 'success' : 'default'} size="sm">
                {loans.length === 3 ? 'Completa' : `${3 - loans.length} disponibles`}
              </Badge>
            </div>
            <div className="admin-saint-loans__saints">
              {SAINTS.map((saint) => {
                const loan = loanForSaint(saint);
                return (
                  <Card key={saint} variant="outlined" padding="md" className="admin-saint-loans__saint-card">
                    <div className="admin-saint-loans__saint-heading">
                      <span className="admin-saint-loans__saint-mark">✦</span>
                      <h3>{saint}</h3>
                    </div>
                    {loan ? (
                      <div className="admin-saint-loans__assigned">
                        <strong>{loan.user?.name ?? 'Usuario'}</strong>
                        <span>Registrado {new Date(loan.createdAt).toLocaleString('es-ES')}</span>
                      </div>
                    ) : (
                      <>
                        <div
                          className="admin-saint-loans__autocomplete"
                          onBlur={() => {
                            window.setTimeout(() => setActiveUserSearch(null), 120);
                          }}
                        >
                          <input
                            type="search"
                            className="admin-saint-loans__select"
                            value={userSearches[saint]}
                            onFocus={() => setActiveUserSearch(saint)}
                            onChange={(event) => {
                              setUserSearches((current) => ({ ...current, [saint]: event.target.value }));
                              setSelectedUsers((current) => ({ ...current, [saint]: '' }));
                              setActiveUserSearch(saint);
                            }}
                            placeholder="Buscar por nombre o identificación"
                            disabled={loans.length >= 3 || registerLoan.isPending}
                            aria-label={`Buscar persona para ${saint}`}
                          />
                          {activeUserSearch === saint && (
                            <div className="admin-saint-loans__autocomplete-options">
                              {users
                                .filter((user) => user.role !== 'admin')
                                .filter((user) => {
                                  const search = normalizeText(userSearches[saint].trim());
                                  return !search || normalizeText(`${user.name} ${user.identification}`).includes(search);
                                })
                                .map((user) => (
                                  <button
                                    key={user.id}
                                    type="button"
                                    className="admin-saint-loans__autocomplete-option"
                                    disabled={assignedUserIds.has(user.id)}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => {
                                      setSelectedUsers((current) => ({ ...current, [saint]: user.id }));
                                      setUserSearches((current) => ({ ...current, [saint]: `${user.name} (${user.identification})` }));
                                      setActiveUserSearch(null);
                                    }}
                                  >
                                    <strong>{user.name}</strong>
                                    <span>{user.identification}{assignedUserIds.has(user.id) ? ' · Ya asignado' : ''}</span>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => handleRegister(saint)}
                          disabled={!selectedUsers[saint] || loans.length >= 3}
                          isLoading={registerLoan.isPending}
                        >
                          Registrar préstamo
                        </Button>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
            {registerLoan.isError && <p className="admin-saint-loans__error" role="alert">{registerLoan.error instanceof Error ? registerLoan.error.message : 'No se pudo registrar el préstamo'}</p>}
          </section>
        )}

        <section className="admin-saint-loans__history" aria-labelledby="history-title">
          <div className="admin-saint-loans__section-heading">
            <div>
              <p className="admin-saint-loans__eyebrow">Historial completo</p>
              <h2 id="history-title">Conteos por persona</h2>
            </div>
            <span className="admin-saint-loans__history-total">{history?.loans.length ?? 0} registros</span>
          </div>
          <Card variant="outlined" padding="md" className="admin-saint-loans__table-card">
            <div className="admin-saint-loans__table-wrap">
              <table>
                <thead><tr><th>Persona</th>{SAINTS.map((saint) => <th key={saint}>{saint}</th>)}</tr></thead>
                <tbody>
                  {(history?.counts ?? []).map((entry) => (
                    <tr key={entry.userId}><td>{entry.userName}</td>{SAINTS.map((saint) => <td key={saint}>{entry.saints[saint]}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {!history?.counts.length && <p className="admin-saint-loans__empty">Aún no hay préstamos registrados.</p>}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};
