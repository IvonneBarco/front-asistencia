import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { AttendanceScanRequest } from '../types';

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
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
