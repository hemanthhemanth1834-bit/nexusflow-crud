import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import type { AppRecord } from '../types'

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  record: AppRecord | null
  onConfirm: (id: number) => void
  isPending: boolean
}

export default function DeleteDialog({
  isOpen,
  onClose,
  record,
  onConfirm,
  isPending,
}: DeleteDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, isPending])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPending) onClose()
  }

  const handleDelete = () => {
    if (record && !isPending) {
      onConfirm(record.id)
    }
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
          aria-label="Delete record confirmation"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-strong w-full max-w-md overflow-hidden rounded-2xl border border-border shadow-2xl"
          >
            {/* Header with icon */}
            <div className="flex flex-col items-center px-6 pt-6 pb-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-red/10">
                <AlertTriangle className="h-7 w-7 text-accent-red" />
              </div>
              <h2 className="text-xl font-bold text-text-primary">Delete Record</h2>
            </div>

            {/* Body */}
            <div className="px-6 py-4 text-center">
              <p className="text-sm leading-relaxed text-text-secondary">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-text-primary">
                  &ldquo;{record.title}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-border px-6 py-4">
              <button
                onClick={onClose}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-border-hover hover:bg-bg-surface-hover disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-red px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent-red/20 transition-all hover:shadow-accent-red/30 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
