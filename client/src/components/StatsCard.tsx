import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { AnimatedCounter } from './AnimatedCounter'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
  glowColor: string
  delay?: number
}

export function StatsCard({ title, value, icon: Icon, color, glowColor, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, boxShadow: `0 8px 32px ${glowColor}` }}
      className="glass rounded-2xl p-6 cursor-default transition-colors duration-300 hover:border-border-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div
            className="relative flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ boxShadow: `0 0 20px ${glowColor}` }}
          >
            <div
              className="absolute inset-0 rounded-xl opacity-20"
              style={{ backgroundColor: glowColor.replace('0.15', '1') }}
            />
            <Icon className={`w-5 h-5 ${color} relative z-10`} />
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-3xl font-bold ${color}`}>
                <AnimatedCounter value={value} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
