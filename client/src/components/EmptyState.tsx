import { motion } from 'framer-motion'
import { Inbox, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-bg-surface flex items-center justify-center mb-6">
        <Icon size={28} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-bg-primary transition-all duration-200 hover:shadow-lg hover:shadow-accent-cyan/20 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #00b4d8)',
          }}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
