import { motion } from 'framer-motion'

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical'
}

const config = {
  low: {
    bg: 'bg-text-muted/10',
    text: 'text-text-muted',
    dot: 'bg-text-muted',
  },
  medium: {
    bg: 'bg-accent-cyan/10',
    text: 'text-accent-cyan',
    dot: 'bg-accent-cyan',
  },
  high: {
    bg: 'bg-accent-amber/10',
    text: 'text-accent-amber',
    dot: 'bg-accent-amber',
  },
  critical: {
    bg: 'bg-accent-red/10',
    text: 'text-accent-red',
    dot: 'bg-accent-red',
  },
} as const

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const c = config[priority]

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${
          priority === 'critical' ? 'animate-pulse-glow' : ''
        }`}
      />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </motion.span>
  )
}
