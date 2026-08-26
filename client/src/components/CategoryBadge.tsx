import { motion } from 'framer-motion'
import {
  Circle,
  FolderKanban,
  CheckSquare,
  StickyNote,
  Lightbulb,
} from 'lucide-react'

interface CategoryBadgeProps {
  category: string
}

const config: Record<string, { bg: string; text: string; icon: typeof Circle }> = {
  general: { bg: 'bg-text-muted/10', text: 'text-text-muted', icon: Circle },
  project: { bg: 'bg-accent-cyan/10', text: 'text-accent-cyan', icon: FolderKanban },
  task: { bg: 'bg-accent-purple/10', text: 'text-accent-purple', icon: CheckSquare },
  note: { bg: 'bg-accent-pink/10', text: 'text-accent-pink', icon: StickyNote },
  idea: { bg: 'bg-accent-amber/10', text: 'text-accent-amber', icon: Lightbulb },
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const c = config[category] || config.general
  const Icon = c.icon

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <Icon size={12} />
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </motion.span>
  )
}
