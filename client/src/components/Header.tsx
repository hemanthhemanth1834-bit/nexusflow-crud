import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Menu, X, LayoutDashboard, TableProperties } from 'lucide-react'

type Page = 'dashboard' | 'records'

interface HeaderProps {
  page: Page
  setPage: (page: Page) => void
  onAddRecord: () => void
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'records', label: 'Records', icon: TableProperties },
]

export default function Header({ page, setPage, onAddRecord }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    if (!tabsRef.current) return
    const activeTab = tabsRef.current.querySelector(`[data-tab="${page}"]`) as HTMLElement | null
    if (activeTab) {
      setIndicator({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      })
    }
  }, [page])

  useEffect(() => {
    setMobileOpen(false)
  }, [page])

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <defs>
                <linearGradient id="hex-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d4ff" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <path
                d="M16 2L28.66 9.5V24.5L16 32L3.34 24.5V9.5L16 2Z"
                stroke="url(#hex-grad)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 8L22.66 12V20L16 24L9.34 20V12L16 8Z"
                fill="url(#hex-grad)"
                opacity="0.3"
              />
              <path
                d="M16 12L19.46 14V18L16 20L12.54 18V14L16 12Z"
                fill="url(#hex-grad)"
              />
            </svg>
            <span
              className="text-lg font-bold gradient-text hidden sm:block"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NexusFlow
            </span>
          </div>

          <nav
            ref={tabsRef}
            className="hidden md:flex items-center gap-1 relative bg-bg-surface/50 rounded-xl px-1 py-1"
          >
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg bg-accent-cyan/10 glow-cyan"
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            {navItems.map((item) => (
              <button
                key={item.id}
                data-tab={item.id}
                onClick={() => setPage(item.id)}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  page === item.id
                    ? 'text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddRecord}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-bg-primary transition-all duration-200 hover:shadow-lg hover:shadow-accent-cyan/20 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #00b4d8)',
              }}
            >
              <Plus size={16} />
              Add Record
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    page === item.id
                      ? 'text-accent-cyan bg-accent-cyan/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onAddRecord()
                  setMobileOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-bg-primary mt-2"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #00b4d8)',
                }}
              >
                <Plus size={16} />
                Add Record
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
