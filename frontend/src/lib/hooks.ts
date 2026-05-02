import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'

export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: api.getCalendar,
    refetchInterval: 5000,
  })
}

export function useSaveCalendarEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, content, event_type }: { date: string; content: string; event_type?: string | null }) =>
      api.saveCalendarEntry(date, content, event_type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] })
    },
  })
}

export function usePlan() {
  return useQuery({
    queryKey: ['plan'],
    queryFn: api.getPlan,
    refetchInterval: 5000,
  })
}

export function useLogs() {
  return useQuery({
    queryKey: ['agent-logs'],
    queryFn: api.getAgentLogs,
    refetchInterval: 5000,
  })
}

export function useCycleStatus() {
  return useQuery({
    queryKey: ['cycle-status'],
    queryFn: api.getCycleStatus,
    refetchInterval: 5000,
  })
}

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: api.getConfig,
  })
}

export function useConnectTelegram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (token: string) => api.connectTelegram(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
    },
  })
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: (file: File) => api.uploadDocument(file),
  })
}
