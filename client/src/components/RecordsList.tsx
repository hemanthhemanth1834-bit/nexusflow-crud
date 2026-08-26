import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Plus,
  LayoutGrid,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react'
import type { AppRecord as RecordType, QueryParams, SortOption } from '../types'
import { SORT_MAP } from '../types'
import { useRecords, useDeleteRecord } from '../hooks/useRecords'
import { useToast } from './Toast'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import CategoryBadge from './CategoryBadge'
import EmptyState from './EmptyState'
import RecordForm from './RecordForm'
import DeleteDialog from './DeleteDialog'
import ViewDialog from './ViewDialog'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function truncate(text: string | null, maxLen: number): string {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

export default function RecordsList({ showAddForm, onAddFormClose }: { showAddForm?: boolean; onAddFormClose?: () => void }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [sort, setSort] = useState<SortOption>('created_desc')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<RecordType | null>(null)
  const [showDelete, setShowDelete] = useState<RecordType | null>(null)
  const [showView, setShowView] = useState<RecordType | null>(null)

  const debouncedSearch = useDebounce(search, 300)
  const deleteMutation = useDeleteRecord()
  const { toast } = useToast()

  const queryParams: QueryParams = useMemo(() => {
    const sortMapping = SORT_MAP[sort]
    return {
      search: debouncedSearch || undefined,
      status: status || undefined,
      priority: priority || undefined,
      category: category || undefined,
      sort: sortMapping ? `${sortMapping.field}:${sortMapping.direction}` : undefined,
      page,
      limit: viewMode === 'table' ? 10 : 9,
    }
  }, [debouncedSearch, status, priority, category, sort, page, viewMode])

  const { data, isLoading, isError, error, refetch } = useRecords(queryParams)

  const records = data?.data ?? []
  const totalRecords = data?.meta?.total ?? 0
  const totalPages = data?.meta?.totalPages ?? 1

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status, priority, category, sort])

  const hasFilters = debouncedSearch || status || priority || category

  useEffect(() => {
    if (showAddForm) {
      setEditingRecord(null)
      setShowForm(true)
      onAddFormClose?.()
    }
  }, [showAddForm, onAddFormClose])

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setPriority('')
    setCategory('')
    setSort('created_desc')
    setPage(1)
  }

  const handleEdit = (record: RecordType) => {
    setEditingRecord(record)
    setShowForm(true)
  }

  const handleView = (record: RecordType) => {
    setShowView(record)
  }

  const handleDeleteClick = (record: RecordType) => {
    setShowDelete(record)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingRecord(null)
  }

  const handleDeleteConfirm = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setShowDelete(null)
      toast('success', 'Record deleted successfully')
    } catch {
      toast('error', 'Failed to delete record')
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
            <span className="gradient-text">Records</span>
          </h1>
          <p className="mt-2 text-text-secondary">
            Manage and organize your records
          </p>
        </motion.div>

        {/* Search + Filters + Sort Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="glass w-full rounded-xl border border-border py-3 pl-12 pr-12 text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-text-secondary">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="glass rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text-primary outline-none transition-all focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="glass rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text-primary outline-none transition-all focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text-primary outline-none transition-all focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="project">Project</option>
              <option value="task">Task</option>
              <option value="note">Note</option>
              <option value="idea">Idea</option>
            </select>

            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-sm text-accent-red transition-colors hover:bg-accent-red/20"
              >
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </motion.button>
            )}
          </div>

          {/* Sort + View Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-text-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="glass rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text-primary outline-none transition-all focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
              >
                <option value="created_desc">Newest First</option>
                <option value="created_asc">Oldest First</option>
                <option value="title_asc">Name A-Z</option>
                <option value="title_desc">Name Z-A</option>
                <option value="updated_desc">Recently Updated</option>
              </select>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border bg-bg-surface p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`rounded-md p-2 transition-all ${
                  viewMode === 'table'
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                aria-label="Table view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, i) => (
              <div
                key={i}
                className="glass animate-pulse rounded-xl border border-border p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-5 w-48 rounded bg-bg-surface-hover" />
                    <div className="h-4 w-72 rounded bg-bg-surface-hover" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-bg-surface-hover" />
                      <div className="h-6 w-16 rounded-full bg-bg-surface-hover" />
                      <div className="h-6 w-16 rounded-full bg-bg-surface-hover" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded bg-bg-surface-hover" />
                    <div className="h-8 w-8 rounded bg-bg-surface-hover" />
                    <div className="h-8 w-8 rounded bg-bg-surface-hover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl border border-accent-red/30 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-red/10">
              <X className="h-6 w-6 text-accent-red" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">
              Failed to Load Records
            </h3>
            <p className="mb-4 text-text-secondary">
              {error instanceof Error ? error.message : 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-accent-cyan px-4 py-2 text-sm font-medium text-bg-primary transition-colors hover:bg-accent-cyan/90"
            >
              Try Again
            </button>
          </motion.div>
        ) : records.length === 0 ? (
          <EmptyState
            title="No Records Found"
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Create your first record to get started.'}
          />
        ) : viewMode === 'table' ? (
          /* Table View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass overflow-hidden rounded-xl border border-border"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-bg-surface/50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {records.map((record) => (
                    <motion.tr
                      key={record.id}
                      variants={itemVariants}
                      className="border-b border-border transition-colors last:border-b-0 hover:bg-bg-surface-hover/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-primary">
                          {record.title}
                        </div>
                        <div className="mt-1 text-sm text-text-muted">
                          {truncate(record.description, 60)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={record.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={record.category} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">
                          {formatDate(record.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(record)}
                            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-accent-cyan/10 hover:text-accent-cyan"
                            aria-label="View record"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(record)}
                            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-accent-purple/10 hover:text-accent-purple"
                            aria-label="Edit record"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(record)}
                            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-accent-red/10 hover:text-accent-red"
                            aria-label="Delete record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          /* Grid/Card View */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {records.map((record) => (
              <motion.div
                key={record.id}
                variants={itemVariants}
                className="glass card-hover group rounded-xl border border-border p-5 transition-all duration-200"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-text-primary line-clamp-1">
                    {record.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleView(record)}
                      className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-accent-cyan/10 hover:text-accent-cyan"
                      aria-label="View record"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(record)}
                      className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-accent-purple/10 hover:text-accent-purple"
                      aria-label="Edit record"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(record)}
                      className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-accent-red/10 hover:text-accent-red"
                      aria-label="Delete record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {record.description && (
                  <p className="mb-4 text-sm text-text-secondary line-clamp-2">
                    {truncate(record.description, 120)}
                  </p>
                )}

                <div className="mb-4 flex flex-wrap gap-2">
                  <StatusBadge status={record.status} />
                  <PriorityBadge priority={record.priority} />
                  <CategoryBadge category={record.category} />
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(record.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(record.updatedAt)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && records.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row"
          >
            <p className="text-sm text-text-secondary">
              Page <span className="font-medium text-text-primary">{page}</span> of{' '}
              <span className="font-medium text-text-primary">{totalPages}</span> &middot;{' '}
              <span className="font-medium text-text-primary">{totalRecords}</span> records total
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary transition-all hover:border-border-hover hover:bg-bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-accent-cyan text-bg-primary'
                          : 'border border-border bg-bg-surface text-text-secondary hover:border-border-hover hover:bg-bg-surface-hover'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary transition-all hover:border-border-hover hover:bg-bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Mobile FAB */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          onClick={() => {
            setEditingRecord(null)
            setShowForm(true)
          }}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent-cyan text-bg-primary shadow-lg shadow-accent-cyan/30 transition-transform hover:scale-110 md:hidden"
          aria-label="Add record"
        >
          <Plus className="h-6 w-6" />
        </motion.button>

        {/* Desktop Add Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            setEditingRecord(null)
            setShowForm(true)
          }}
          className="fixed bottom-8 right-8 z-40 hidden items-center gap-2 rounded-xl bg-accent-cyan px-5 py-3 font-medium text-bg-primary shadow-lg shadow-accent-cyan/30 transition-all hover:scale-105 hover:shadow-accent-cyan/40 md:flex"
        >
          <Plus className="h-5 w-5" />
          Add Record
        </motion.button>

        {/* Modals */}
        <RecordForm
          isOpen={showForm}
          onClose={handleFormClose}
          record={editingRecord}
        />
        <DeleteDialog
          isOpen={!!showDelete}
          onClose={() => setShowDelete(null)}
          record={showDelete}
          onConfirm={handleDeleteConfirm}
          isPending={deleteMutation.isPending}
        />
        <ViewDialog
          isOpen={!!showView}
          onClose={() => setShowView(null)}
          record={showView}
          onEdit={(record) => {
            setShowView(null)
            handleEdit(record)
          }}
        />
      </div>
    </div>
  )
}
