import { z } from 'zod'

export const createRecordSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().default(''),
  status: z.enum(['active', 'archived', 'draft']).optional().default('active'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  category: z.enum(['general', 'project', 'task', 'note', 'idea']).optional().default('general'),
  projectId: z.number().int().positive().optional().nullable(),
})

export const updateRecordSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['active', 'archived', 'draft']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.enum(['general', 'project', 'task', 'note', 'idea']).optional(),
  projectId: z.number().int().positive().optional().nullable(),
})

export const queryParamsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'archived', 'draft']).optional(),
  category: z.enum(['general', 'project', 'task', 'note', 'idea']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(50),
})

export type CreateRecordInput = z.infer<typeof createRecordSchema>
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>
export type QueryParams = z.infer<typeof queryParamsSchema>
