import { motion } from 'framer-motion'
import {
  Database,
  CheckCircle,
  Clock,
  Layers,
  Plus,
  ArrowRight,
  FileText,
  BarChart3,
} from 'lucide-react'
import { useStats, useRecords } from '../hooks/useRecords'
import { StatsCard } from './StatsCard'
import { AnimatedCounter } from './AnimatedCounter'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'
import type { AppRecord } from '../types'

interface DashboardProps {
  setPage: (page: 'dashboard' | 'records') => void
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
}

const priorityColors: Record<string, string> = {
  low: 'text-accent-green',
  medium: 'text-accent-amber',
  high: 'text-accent-purple',
  critical: 'text-accent-red',
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`text-xs font-medium capitalize ${priorityColors[priority] ?? 'text-text-muted'}`}>
      {priority}
    </span>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 animate-pulse">
      <div className="h-4 w-40 bg-bg-elevated rounded" />
      <div className="h-4 w-16 bg-bg-elevated rounded" />
      <div className="h-4 w-12 bg-bg-elevated rounded" />
      <div className="h-4 w-24 bg-bg-elevated rounded ml-auto" />
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function Dashboard({ setPage }: DashboardProps) {
  const { data: stats, isLoading: statsLoading } = useStats()
  const { data: recordsData, isLoading: recordsLoading } = useRecords({
    sort: 'createdAt:desc',
    limit: 5,
  })

  const statsCards = stats
    ? [
        { title: 'Total Records', value: stats.total, icon: Database, color: 'text-accent-cyan', glowColor: 'rgba(0, 212, 255, 0.15)' },
        { title: 'Active', value: stats.active, icon: CheckCircle, color: 'text-accent-green', glowColor: 'rgba(34, 197, 94, 0.15)' },
        { title: 'Recently Added', value: stats.recentlyCreated, icon: Clock, color: 'text-accent-purple', glowColor: 'rgba(168, 85, 247, 0.15)' },
        { title: 'Categories', value: Object.keys(stats.byCategory).length, icon: Layers, color: 'text-accent-pink', glowColor: 'rgba(236, 72, 153, 0.15)' },
      ]
    : []

  const recentRecords = recordsData?.data ?? []

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-24 left-[10%] w-16 h-16 border border-accent-cyan/10 rotate-45 rounded-md" />
        <div className="absolute top-40 right-[15%] w-8 h-8 border border-accent-purple/10 rounded-full" />
        <div className="absolute bottom-32 left-[20%] w-12 h-12 border border-accent-pink/10 rotate-12 rounded-lg" />
        <div className="absolute top-[60%] right-[8%] w-20 h-20 border border-accent-green/10 rotate-45 rounded-md" />
        <div className="absolute top-16 left-[55%] w-6 h-6 border border-accent-amber/10 rounded-full" />
        <div className="absolute bottom-48 right-[30%] w-10 h-10 border border-accent-cyan/10 rotate-30 rounded-sm" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Hero Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center space-y-8 pt-8"
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight">
              Manage your data.
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold gradient-text leading-tight mt-1">
              Beautifully.
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-text-muted text-lg max-w-xl mx-auto"
          >
            Securely stored in a persistent database. Refresh-proof. Restart-proof.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              onClick={() => setPage('records')}
              className="group relative px-6 py-3 rounded-xl font-semibold text-sm
                         bg-bg-surface border border-border text-text-primary
                         hover:border-accent-cyan/50 hover:text-accent-cyan
                         transition-all duration-300 flex items-center gap-2"
            >
              View Records
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setPage('records')}
              className="group relative px-6 py-3 rounded-xl font-semibold text-sm
                         bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan
                         hover:bg-accent-cyan/20 hover:border-accent-cyan/50
                         transition-all duration-300 flex items-center gap-2 glow-cyan"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </motion.div>
        </motion.section>

        {/* Stats Cards */}
        <section>
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-xl bg-bg-elevated" />
                    <div>
                      <div className="h-4 w-24 bg-bg-elevated rounded mb-2" />
                      <div className="h-8 w-16 bg-bg-elevated rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((card, i) => (
                <StatsCard key={card.title} {...card} delay={i * 0.1} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Records */}
        <section className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Recent Activity</h2>
            <button
              onClick={() => setPage('records')}
              className="text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recordsLoading ? (
            <div className="space-y-1 divide-y divide-border">
              {[0, 1, 2, 3, 4].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : recentRecords.length === 0 ? (
            <EmptyState
              icon={Database}
              title="No records yet"
              description="Create your first record to get started."
            />
          ) : (
            <div className="space-y-1 divide-y divide-border">
              {recentRecords.map((record: AppRecord) => (
                <div
                  key={record.id}
                  className="flex items-center gap-4 py-3 hover:bg-bg-surface-hover rounded-lg px-2 -mx-2 transition-colors"
                >
                  <span className="text-text-primary text-sm font-medium truncate min-w-0 flex-1">
                    {record.title}
                  </span>
                  <StatusBadge status={record.status} />
                  <PriorityBadge priority={record.priority} />
                  <span className="text-text-muted text-xs whitespace-nowrap hidden sm:block">
                    {formatDate(record.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                title: 'Create Record',
                description: 'Add a new entry to your database instantly.',
                icon: Plus,
                color: 'text-accent-cyan',
                glowColor: 'rgba(0, 212, 255, 0.15)',
                action: () => setPage('records'),
              },
              {
                title: 'Browse Records',
                description: 'Search, filter, and manage existing records.',
                icon: FileText,
                color: 'text-accent-purple',
                glowColor: 'rgba(168, 85, 247, 0.15)',
                action: () => setPage('records'),
              },
              {
                title: 'View Statistics',
                description: 'Insights and breakdowns of your data.',
                icon: BarChart3,
                color: 'text-accent-pink',
                glowColor: 'rgba(236, 72, 153, 0.15)',
                action: () => setPage('records'),
              },
            ].map((action, i) => (
              <motion.button
                key={action.title}
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: `0 8px 32px ${action.glowColor}` }}
                onClick={action.action}
                className="glass rounded-2xl p-6 text-left group transition-colors duration-300 hover:border-border-hover"
              >
                <div
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{ boxShadow: `0 0 20px ${action.glowColor}` }}
                >
                  <div
                    className="absolute inset-0 rounded-xl opacity-20"
                    style={{ backgroundColor: action.glowColor.replace('0.15', '1') }}
                  />
                  <action.icon className={`w-5 h-5 ${action.color} relative z-10`} />
                </div>
                <h3 className="text-text-primary font-semibold text-base mb-1 flex items-center gap-2">
                  {action.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-text-muted text-sm">{action.description}</p>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Footer spacer */}
        <div className="h-8" />
      </div>
    </div>
  )
}
