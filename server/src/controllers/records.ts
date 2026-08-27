import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import prisma from '../utils/prisma.js'
import { createRecordSchema, updateRecordSchema } from '../validators/record.js'

export async function listRecords(req: Request, res: Response) {
  try {
    const search = req.query.search as string | undefined
    const status = req.query.status as string | undefined
    const category = req.query.category as string | undefined
    const priority = req.query.priority as string | undefined
    const sort = req.query.sort as string | undefined
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50))

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (status) where.status = status
    if (category) where.category = category
    if (priority) where.priority = priority

    let orderBy: Record<string, string> = { createdAt: 'desc' }

    if (sort) {
      const [field, direction] = sort.split(':')
      const allowedFields = ['createdAt', 'updatedAt', 'title', 'status', 'priority', 'category']
      if (allowedFields.includes(field)) {
        orderBy = { [field]: direction === 'asc' ? 'asc' : 'desc' }
      }
    }

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.record.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.record.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    res.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error('listRecords error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getRecord(req: Request, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const record = await prisma.record.findUnique({ where: { id } })

    if (!record) {
      res.status(404).json({ error: 'Record not found' })
      return
    }

    res.json(record)
  } catch (error) {
    console.error('getRecord error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createRecord(req: Request, res: Response) {
  try {
    const parsed = createRecordSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
      return
    }

    const record = await prisma.record.create({
      data: parsed.data as Prisma.RecordUncheckedCreateInput,
    })

    res.status(201).json(record)
  } catch (error) {
    console.error('createRecord error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateRecord(req: Request, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const existing = await prisma.record.findUnique({ where: { id } })

    if (!existing) {
      res.status(404).json({ error: 'Record not found' })
      return
    }

    const parsed = updateRecordSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
      return
    }

    const record = await prisma.record.update({
      where: { id },
      data: parsed.data as Prisma.RecordUncheckedUpdateInput,
    })

    res.json(record)
  } catch (error) {
    console.error('updateRecord error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteRecord(req: Request, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const existing = await prisma.record.findUnique({ where: { id } })

    if (!existing) {
      res.status(404).json({ error: 'Record not found' })
      return
    }

    await prisma.record.delete({ where: { id } })

    res.json({ message: 'Record deleted successfully' })
  } catch (error) {
    console.error('deleteRecord error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getStats(req: Request, res: Response) {
  try {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [total, activeCount, archivedCount, draftCount, recentlyCreated, recentlyUpdated, byPriority, byCategory] = await Promise.all([
      prisma.record.count(),
      prisma.record.count({ where: { status: 'active' } }),
      prisma.record.count({ where: { status: 'archived' } }),
      prisma.record.count({ where: { status: 'draft' } }),
      prisma.record.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.record.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
      prisma.record.groupBy({ by: ['priority'], _count: true }),
      prisma.record.groupBy({ by: ['category'], _count: true }),
    ])

    const priorityMap: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 }
    for (const item of byPriority) {
      priorityMap[item.priority] = item._count
    }

    const categoryMap: Record<string, number> = { general: 0, project: 0, task: 0, note: 0, idea: 0 }
    for (const item of byCategory) {
      categoryMap[item.category] = item._count
    }

    res.json({
      total,
      active: activeCount,
      archived: archivedCount,
      draft: draftCount,
      recentlyCreated,
      recentlyUpdated,
      byStatus: {
        active: activeCount,
        archived: archivedCount,
        draft: draftCount,
      },
      byPriority: priorityMap,
      byCategory: categoryMap,
    })
  } catch (error) {
    console.error('getStats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function searchRecords(req: Request, res: Response) {
  try {
    const { q } = req.query as { q?: string }

    if (!q) {
      res.status(400).json({ error: 'Query parameter "q" is required' })
      return
    }

    const records = await prisma.record.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ data: records, total: records.length })
  } catch (error) {
    console.error('searchRecords error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
