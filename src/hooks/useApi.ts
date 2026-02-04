import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { 
  AttendanceScanRequest, 
  CreateSessionRequest, 
  BulkUsersRequest,
  JoinGroupRequest,
  CreateGroupRequest,
  UpdateGroupRequest,
} from '../types';

// Hook para obtener el leaderboard
export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => apiClient.getLeaderboard(),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
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

// Hook para obtener todos los usuarios
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getAllUsers(),
  });
};

// Hook para obtener grupos disponibles
export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: () => apiClient.getGroups(),
  });
};

// Hook para obtener mi grupo actual
export const useMyGroup = () => {
  return useQuery({
    queryKey: ['my-group'],
    queryFn: () => apiClient.getMyGroup(),
  });
};

// Hook para unirse a un grupo
export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinGroupRequest) => apiClient.joinGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-group'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Hook para asignar grupo a usuario (admin)
export const useAssignUserGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, groupId, reason }: { userId: string; groupId: string; reason?: string }) =>
      apiClient.assignUserGroup(userId, { groupId, ...(reason && { reason }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['all-groups'] });
    },
  });
};

// Hook para obtener historial de grupos de usuario (admin)
export const useUserGroupHistory = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-group-history', userId],
    queryFn: () => apiClient.getUserGroupHistory(userId!),
    enabled: !!userId,
  });
};

// Hook para obtener todos los grupos (admin)
export const useAllGroups = () => {
  return useQuery({
    queryKey: ['all-groups'],
    queryFn: () => apiClient.getAllGroups(),
  });
};

// Hook para crear grupo (admin)
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => apiClient.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

// Hook para actualizar grupo (admin)
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: UpdateGroupRequest }) =>
      apiClient.updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

// Hook para eliminar/desactivar grupo (admin)
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => apiClient.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};
