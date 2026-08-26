import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Pencil,
  Calendar,
  Clock,
  Hash,
  FileText,
} from 'lucide-react'
import type { AppRecord } from '../types'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import CategoryBadge from './CategoryBadge'

interface ViewDialogProps {
  isOpen: boolean
  onClose: () => void
  record: AppRecord | null
  onEdit: (record: AppRecord) => void
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ViewDialog({
  isOpen,
  onClose,
  record,
  onEdit,
}: ViewDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && record && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={`View record: ${record.title}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-strong w-full max-w-2xl overflow-hidden rounded-2xl border border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-text-primary">
                  {record.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={record.status} />
                  <PriorityBadge priority={record.priority} />
                  <CategoryBadge category={record.category} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(record)}
                  className="flex items-center gap-2 rounded-xl border border-accent-purple/30 bg-accent-purple/10 px-4 py-2 text-sm font-medium text-accent-purple transition-all hover:bg-accent-purple/20"
                  aria-label="Edit record"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {/* Description */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-text-muted">
                  <FileText className="h-4 w-4" />
                  Description
                </div>
                {record.description ? (
                  <div className="rounded-xl border border-border bg-bg-surface/50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
                      {record.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic">No description provided.</p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-surface/50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-cyan/10">
                    <Hash className="h-4 w-4 text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Record ID</p>
                    <p className="text-sm font-medium text-text-primary">{record.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-surface/50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-green/10">
                    <Calendar className="h-4 w-4 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Created</p>
                    <p className="text-sm font-medium text-text-primary">
                      {formatDateTime(record.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-surface/50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-purple/10">
                    <Clock className="h-4 w-4 text-accent-purple" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Updated</p>
                    <p className="text-sm font-medium text-text-primary">
                      {formatDateTime(record.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-border px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-xl border border-border bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-border-hover hover:bg-bg-surface-hover"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
