import type { VercelRequest, VercelResponse } from '@vercel/node'

let nextId = 13
const records: Record<string, unknown>[] = [
  { id: 1, title: 'Project Alpha', description: 'Main project deliverables', status: 'active', priority: 'high', category: 'project', createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 2, title: 'Design System', description: 'Component library and design tokens', status: 'active', priority: 'medium', category: 'project', createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 3, title: 'API Documentation', description: 'REST API endpoint documentation', status: 'active', priority: 'medium', category: 'task', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 4, title: 'Bug Fix: Login', description: 'Fix authentication redirect issue', status: 'active', priority: 'critical', category: 'task', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 5, title: 'Sprint Retrospective', description: 'Notes from team retro', status: 'archived', priority: 'low', category: 'note', createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 6, title: 'Database Migration', description: 'Migrate from v2 to v3 schema', status: 'draft', priority: 'high', category: 'task', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 7, title: 'New Feature Idea', description: 'AI-powered search suggestions', status: 'draft', priority: 'medium', category: 'idea', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 8, title: 'Performance Audit', description: 'Lighthouse and bundle analysis', status: 'active', priority: 'medium', category: 'project', createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 9, title: 'User Research Notes', description: 'Interview findings from 10 users', status: 'archived', priority: 'low', category: 'note', createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 10, title: 'Deploy Pipeline', description: 'CI/CD setup for staging', status: 'active', priority: 'high', category: 'task', createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 11, title: 'Mobile App Concept', description: 'React Native prototype', status: 'draft', priority: 'low', category: 'idea', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 12, title: 'Security Review', description: 'OWASP compliance checklist', status: 'active', priority: 'critical', category: 'task', createdAt: new Date(Date.now() - 9 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
]

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  const url = (req.url || '').split('?')[0]
  const method = req.method || 'GET'

  if (url === '/api/records/stats' && method === 'GET') {
    const now = Date.now()
    const sevenDays = 7 * 86400000
    const activeCount = records.filter(r => r.status === 'active').length
    const archivedCount = records.filter(r => r.status === 'archived').length
    const draftCount = records.filter(r => r.status === 'draft').length
    const recentlyCreated = records.filter(r => now - new Date(r.createdAt as string).getTime() < sevenDays).length
    const recentlyUpdated = records.filter(r => now - new Date(r.updatedAt as string).getTime() < sevenDays).length
    const priorityMap: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 }
    records.forEach(r => { priorityMap[r.priority as string] = (priorityMap[r.priority as string] || 0) + 1 })
    const categoryMap: Record<string, number> = { general: 0, project: 0, task: 0, note: 0, idea: 0 }
    records.forEach(r => { categoryMap[r.category as string] = (categoryMap[r.category as string] || 0) + 1 })
    res.json({ total: records.length, active: activeCount, archived: archivedCount, draft: draftCount, recentlyCreated, recentlyUpdated, byStatus: { active: activeCount, archived: archivedCount, draft: draftCount }, byPriority: priorityMap, byCategory: categoryMap })
    return
  }

  if (url === '/api/records/search' && method === 'GET') {
    const q = (req.query.q as string || '').toLowerCase()
    if (!q) { res.status(400).json({ error: 'Query parameter "q" is required' }); return }
    const filtered = records.filter(r => (r.title as string).toLowerCase().includes(q) || (r.description as string).toLowerCase().includes(q))
    res.json({ data: filtered, total: filtered.length })
    return
  }

  if (method === 'GET' && url === '/api/records') {
    const status = req.query.status as string | undefined
    const category = req.query.category as string | undefined
    const priority = req.query.priority as string | undefined
    const sort = req.query.sort as string | undefined
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50))

    let filtered = [...records]
    if (status) filtered = filtered.filter(r => r.status === status)
    if (category) filtered = filtered.filter(r => r.category === category)
    if (priority) filtered = filtered.filter(r => r.priority === priority)
    if (sort) {
      const [field, direction] = sort.split(':')
      const allowed = ['createdAt', 'updatedAt', 'title', 'status', 'priority', 'category']
      if (allowed.includes(field)) {
        filtered.sort((a, b) => {
          const av = String(a[field] || ''), bv = String(b[field] || '')
          return direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
        })
      }
    } else {
      filtered.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
    }
    const total = filtered.length
    const skip = (page - 1) * limit
    const data = filtered.slice(skip, skip + limit)
    res.json({ data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } })
    return
  }

  if (method === 'GET' && url.match(/^\/api\/records\/\d+$/)) {
    const id = parseInt(url.split('/').pop()!, 10)
    const record = records.find(r => r.id === id)
    if (!record) { res.status(404).json({ error: 'Record not found' }); return }
    res.json(record)
    return
  }

  if (method === 'POST' && url === '/api/records') {
    const { title, description = '', status = 'active', priority = 'medium', category = 'general' } = req.body || {}
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Validation failed', details: { fieldErrors: { title: ['Title is required'] } } }); return
    }
    const now = new Date().toISOString()
    const record = { id: nextId++, title: title.trim(), description, status, priority, category, createdAt: now, updatedAt: now }
    records.unshift(record)
    res.status(201).json(record)
    return
  }

  if (method === 'PUT' && url.match(/^\/api\/records\/\d+$/)) {
    const id = parseInt(url.split('/').pop()!, 10)
    const idx = records.findIndex(r => r.id === id)
    if (idx === -1) { res.status(404).json({ error: 'Record not found' }); return }
    const current = records[idx]
    const { title, description, status, priority, category } = req.body || {}
    const updated = { ...current, title: title ?? current.title, description: description ?? current.description, status: status ?? current.status, priority: priority ?? current.priority, category: category ?? current.category, updatedAt: new Date().toISOString() }
    records[idx] = updated
    res.json(updated)
    return
  }

  if (method === 'DELETE' && url.match(/^\/api\/records\/\d+$/)) {
    const id = parseInt(url.split('/').pop()!, 10)
    const idx = records.findIndex(r => r.id === id)
    if (idx === -1) { res.status(404).json({ error: 'Record not found' }); return }
    records.splice(idx, 1)
    res.json({ message: 'Record deleted successfully' })
    return
  }

  res.status(404).json({ error: 'Not found' })
}
