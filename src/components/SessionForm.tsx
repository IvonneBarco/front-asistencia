import React, { useState } from 'react';
import { Button, Card } from './ui';
import type { CreateSessionRequest } from '../types';
import './SessionForm.css';

interface SessionFormProps {
  onSubmit: (data: CreateSessionRequest) => Promise<void>;
  isLoading?: boolean;
}

export const SessionForm: React.FC<SessionFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  // Obtener fecha mínima (hoy) en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const validateForm = (): boolean => {
    if (!name || name.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return false;
    }

    if (!startDate || !startTime) {
      setError('La fecha y hora de inicio son requeridas');
      return false;
    }

    if (!endDate || !endTime) {
      setError('La fecha y hora de fin son requeridas');
      return false;
    }

    const startsAt = new Date(`${startDate}T${startTime}`);
    const endsAt = new Date(`${endDate}T${endTime}`);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      setError('Fechas inválidas');
      return false;
    }

    if (endsAt <= startsAt) {
      setError('La fecha de fin debe ser posterior a la de inicio');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const startsAt = new Date(`${startDate}T${startTime}`);
    const endsAt = new Date(`${endDate}T${endTime}`);

    const data: CreateSessionRequest = {
      name: name.trim(),
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
    };

    try {
      await onSubmit(data);
      // Resetear formulario
      setName('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al crear la sesión'
      );
    }
  };

  return (
    <Card variant="outlined" padding="lg">
      <form onSubmit={handleSubmit} className="session-form">
        <h3 className="session-form__title">Nueva Sesión</h3>

        <div className="session-form__field">
          <label htmlFor="name" className="session-form__label">
            Nombre de la sesión
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="session-form__input"
            placeholder="Ej: Encuentro Semanal - Febrero"
            maxLength={100}
            disabled={isLoading}
            required
          />
        </div>

        <div className="session-form__row">
          <div className="session-form__field">
            <label htmlFor="startDate" className="session-form__label">
              Fecha de inicio
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="session-form__input session-form__input--date"
              min={today}
              disabled={isLoading}
              required
            />
          </div>

          <div className="session-form__field">
            <label htmlFor="startTime" className="session-form__label">
              Hora de inicio
            </label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="session-form__input session-form__input--time"
              step="300"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="session-form__row">
          <div className="session-form__field">
            <label htmlFor="endDate" className="session-form__label">
              Fecha de fin
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="session-form__input session-form__input--date"
              min={startDate || today}
              disabled={isLoading}
              required
            />
          </div>

          <div className="session-form__field">
            <label htmlFor="endTime" className="session-form__label">
              Hora de fin
            </label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="session-form__input session-form__input--time"
              step="300"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {error && (
          <div className="session-form__error" role="alert">
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
          Crear Sesión
        </Button>
      </form>
    </Card>
  );
};
