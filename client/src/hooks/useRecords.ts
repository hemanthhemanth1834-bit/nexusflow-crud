import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { QueryParams, CreateRecordInput, UpdateRecordInput } from '../types'

export function useRecords(params?: QueryParams) {
  return useQuery({
    queryKey: ['records', params],
    queryFn: () => api.records.list(params),
  })
}

export function useRecord(id: number) {
  return useQuery({
    queryKey: ['record', id],
    queryFn: () => api.records.get(id),
    enabled: !!id,
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => api.records.stats(),
  })
}

export function useCreateRecord() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateRecordInput) => api.records.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useUpdateRecord() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRecordInput }) =>
      api.records.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['records'] })
      queryClient.invalidateQueries({ queryKey: ['record', id] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useDeleteRecord() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => api.records.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
