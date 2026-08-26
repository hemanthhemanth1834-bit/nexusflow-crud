import { motion } from 'framer-motion'

interface StatusBadgeProps {
  status: 'active' | 'archived' | 'draft'
}

const config = {
  active: {
    bg: 'bg-accent-green/10',
    text: 'text-accent-green',
    dot: 'bg-accent-green',
    shadow: '0 0 8px rgba(34, 197, 94, 0.3)',
  },
  archived: {
    bg: 'bg-accent-amber/10',
    text: 'text-accent-amber',
    dot: 'bg-accent-amber',
    shadow: '0 0 8px rgba(245, 158, 11, 0.2)',
  },
  draft: {
    bg: 'bg-text-muted/10',
    text: 'text-text-muted',
    dot: 'bg-text-muted',
    shadow: 'none',
  },
} as const

export default function StatusBadge({ status }: StatusBadgeProps) {
  const c = config[status]

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
      style={{ boxShadow: c.shadow }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  )
}
