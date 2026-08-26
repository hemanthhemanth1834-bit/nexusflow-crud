import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import RecordsList from './components/RecordsList'
import Header from './components/Header'
import Background3D from './components/Background3D'
import { ToastProvider } from './components/Toast'

export type Page = 'dashboard' | 'records'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg-primary bg-mesh">
        <Background3D />
        <Header
          page={page}
          setPage={setPage}
          onAddRecord={() => {
            setPage('records')
            setTimeout(() => setShowAddForm(true), 100)
          }}
        />
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
          {page === 'dashboard' && <Dashboard setPage={setPage} />}
          {page === 'records' && <RecordsList showAddForm={showAddForm} onAddFormClose={() => setShowAddForm(false)} />}
        </main>
      </div>
    </ToastProvider>
  )
}
