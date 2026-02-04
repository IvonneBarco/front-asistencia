import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { AttendanceScanRequest, CreateSessionRequest, BulkUsersRequest } from '../types';

// Hook para obtener el leaderboard
export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => apiClient.getLeaderboard(),
  });
};

// Hook para escanear asistencia
export const useAttendanceScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AttendanceScanRequest) =>
      apiClient.scanAttendance(data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

// Hook para obtener datos del usuario actual
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.getCurrentUser(),
  });
};

// Hook para obtener sesiones (admin)
export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiClient.getSessions(),
  });
};

// Hook para crear sesión (admin)
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionRequest) =>
      apiClient.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Hook para obtener QR de sesión (admin)
export const useSessionQR = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['session-qr', sessionId],
    queryFn: () => apiClient.getSessionQR(sessionId!),
    enabled: !!sessionId,
  });
};

// Hook para desactivar sesión (admin)
export const useDeactivateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient.deactivateSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Hook para crear usuarios en bulk (admin)
export const useCreateBulkUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUsersRequest) =>
      apiClient.createBulkUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Hook para subir CSV de usuarios (admin)
export const useUploadUsersCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => apiClient.uploadUsersCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
