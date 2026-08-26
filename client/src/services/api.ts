import type { AppRecord, PaginatedResponse, Stats, CreateRecordInput, UpdateRecordInput, QueryParams } from '../types'

const API_BASE = '/api'

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.category) searchParams.set('category', params.category)
  if (params.priority) searchParams.set('priority', params.priority)
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export const api = {
  records: {
    list: (params?: QueryParams) =>
      fetchApi<PaginatedResponse>(`/records${buildQueryString(params || {})}`),
    
    get: (id: number) =>
      fetchApi<AppRecord>(`/records/${id}`),
    
    create: (data: CreateRecordInput) =>
      fetchApi<AppRecord>('/records', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: number, data: UpdateRecordInput) =>
      fetchApi<AppRecord>(`/records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: number) =>
      fetchApi<{ message: string }>(`/records/${id}`, {
        method: 'DELETE',
      }),
    
    search: (query: string) =>
      fetchApi<{ data: AppRecord[]; total: number }>(`/records/search?q=${encodeURIComponent(query)}`),
    
    stats: () =>
      fetchApi<Stats>('/records/stats'),
  },
}
