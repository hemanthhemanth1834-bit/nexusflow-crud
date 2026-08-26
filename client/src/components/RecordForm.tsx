import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Loader2, FileText } from 'lucide-react'
import type { AppRecord } from '../types'
import { useCreateRecord, useUpdateRecord } from '../hooks/useRecords'

interface RecordFormProps {
  isOpen: boolean
  onClose: () => void
  record?: AppRecord | null
}

const statusStyles: Record<string, { active: string; inactive: string; label: string }> = {
  active: { active: 'border-accent-green/50 bg-accent-green/10 text-accent-green', inactive: 'border-border bg-bg-surface text-text-secondary hover:border-border-hover', label: 'Active' },
  archived: { active: 'border-text-muted/50 bg-text-muted/10 text-text-muted', inactive: 'border-border bg-bg-surface text-text-secondary hover:border-border-hover', label: 'Archived' },
  draft: { active: 'border-accent-amber/50 bg-accent-amber/10 text-accent-amber', inactive: 'border-border bg-bg-surface text-text-secondary hover:border-border-hover', label: 'Draft' },
}

const priorityStyles: Record<string, { active: string; inactive: string; label: string }> = {
  low: { active: 'border-accent-green/50 bg-accent-green/10 text-accent-green', inactive: 'border-border bg-bg-surface text-text-secondary hover:border-border-hover', label: 'Low' },
  medium: { active: 'border-accent-amber/50 bg-accent-amber/10 text-accent-amber', inactive: 'border-border bg-bg-surface text-text-secondary hover:border-border-hover', label: 'Medium' },
  high: { active: 'border-accent-pink/50 bg-accent-pink/10 text-accent-pink', inactive: 'border-border bg-bg-surface text-text-secondary hover:border-border-hover', label: 'High' },
  critical: { active: 'border-accent-red/50 bg-accent-red/10 text-accent-red', inactive: 'border-border bg-bg-surface text-text-secondary hover:border-border-hover', label: 'Critical' },
}

const categoryOptions = ['general', 'project', 'task', 'note', 'idea'] as const

interface FormErrors {
  title?: string
  description?: string
}

export default function RecordForm({ isOpen, onClose, record }: RecordFormProps) {
  const isEditing = !!record
  const titleInputRef = useRef<HTMLInputElement>(null)

  const createMutation = useCreateRecord()
  const updateMutation = useUpdateRecord()
  const isPending = createMutation.isPending || updateMutation.isPending

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<string>('active')
  const [priority, setPriority] = useState<string>('medium')
  const [category, setCategory] = useState<string>('general')
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (record) {
        setTitle(record.title)
        setDescription(record.description || '')
        setStatus(record.status)
        setPriority(record.priority)
        setCategory(record.category)
      } else {
        setTitle('')
        setDescription('')
        setStatus('active')
        setPriority('medium')
        setCategory('general')
      }
      setErrors({})
      setServerError(null)
      setTimeout(() => titleInputRef.current?.focus(), 100)
    }
  }, [isOpen, record])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must be 200 characters or less'
    }
    if (description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validate()) return

    const baseData = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      category,
    }

    try {
      if (isEditing && record) {
        await updateMutation.mutateAsync({ id: record.id, data: baseData })
      } else {
        await createMutation.mutateAsync(baseData)
      }
      onClose()
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? 'Edit record' : 'Create record'}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl border border-border shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-cyan/10">
                  <FileText className="h-5 w-5 text-accent-cyan" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {isEditing ? 'Edit Record' : 'Create Record'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 rounded-lg border border-accent-red/30 bg-accent-red/10 px-4 py-3 text-sm text-accent-red"
                >
                  {serverError}
                </motion.div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Title <span className="text-accent-red">*</span>
                  </label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
                    }}
                    placeholder="Enter record title..."
                    maxLength={200}
                    className="w-full rounded-xl border border-border bg-bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {errors.title ? (
                      <span className="text-xs text-accent-red">{errors.title}</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-text-muted">{title.length}/200</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
                    }}
                    placeholder="Add a description..."
                    rows={4}
                    maxLength={2000}
                    className="w-full resize-none rounded-xl border border-border bg-bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {errors.description ? (
                      <span className="text-xs text-accent-red">{errors.description}</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-text-muted">{description.length}/2000</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">Status</label>
                  <div className="flex gap-2">
                    {Object.entries(statusStyles).map(([key, styles]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatus(key)}
                        className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                          status === key ? styles.active : styles.inactive
                        }`}
                      >
                        {styles.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">Priority</label>
                  <div className="flex gap-2">
                    {Object.entries(priorityStyles).map(([key, styles]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPriority(key)}
                        className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                          priority === key ? styles.active : styles.inactive
                        }`}
                      >
                        {styles.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg-surface px-4 py-2.5 text-text-primary outline-none transition-all duration-200 focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-xl border border-border bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-border-hover hover:bg-bg-surface-hover disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-xl bg-accent-cyan px-5 py-2.5 text-sm font-medium text-bg-primary shadow-lg shadow-accent-cyan/20 transition-all hover:shadow-accent-cyan/30 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isEditing ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
