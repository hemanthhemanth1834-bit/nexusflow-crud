export interface AppRecord {
  id: number
  title: string
  description: string
  status: 'active' | 'archived' | 'draft'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'general' | 'project' | 'task' | 'note' | 'idea'
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse {
  data: AppRecord[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface Stats {
  total: number
  active: number
  archived: number
  draft: number
  recentlyCreated: number
  recentlyUpdated: number
  byStatus: {
    active: number
    archived: number
    draft: number
  }
  byPriority: {
    low: number
    medium: number
    high: number
    critical: number
  }
  byCategory: Record<string, number>
}

export interface CreateRecordInput {
  title: string
  description?: string
  status?: string
  priority?: string
  category?: string
}

export interface UpdateRecordInput {
  title?: string
  description?: string
  status?: string
  priority?: string
  category?: string
}

export interface QueryParams {
  search?: string
  status?: string
  category?: string
  priority?: string
  sort?: string
  page?: number
  limit?: number
}

export type SortOption =
  | 'created_desc'
  | 'created_asc'
  | 'title_asc'
  | 'title_desc'
  | 'updated_desc'

export const SORT_MAP: Record<SortOption, { field: string; direction: string }> = {
  created_desc: { field: 'createdAt', direction: 'desc' },
  created_asc: { field: 'createdAt', direction: 'asc' },
  title_asc: { field: 'title', direction: 'asc' },
  title_desc: { field: 'title', direction: 'desc' },
  updated_desc: { field: 'updatedAt', direction: 'desc' },
}
