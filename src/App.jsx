import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { weeklyActions } from './data/weeklyActions'
import { LayoutDashboard, ListChecks, Compass, BookOpen, Target } from 'lucide-react'
import Dashboard from './components/Dashboard'
import WeeklyActions from './components/WeeklyActions'
import CultureAudit from './components/CultureAudit'
import Journal from './components/Journal'
import Goals from './components/Goals'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'actions', label: 'Actions', icon: ListChecks },
  { id: 'audit', label: 'Audit', icon: Compass },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'goals', label: 'Goals', icon: Target },
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [completedActions, setCompletedActions] = useLocalStorage('yau-actions', {})
  const [auditScores, setAuditScores] = useLocalStorage('yau-audit', {})
  const [journalEntries, setJournalEntries] = useLocalStorage('yau-journal', [])
  const [goals, setGoals] = useLocalStorage('yau-goals', { belongingVision: '', weeklyGoals: ['', '', '', '', ''] })

  const totalActions = weeklyActions.reduce((sum, w) => sum + w.actions.length, 0)
  const completedCount = Object.values(completedActions).filter(Boolean).length
  const overallPercent = Math.round((completedCount / totalActions) * 100)

  const handleToggleAction = (id) => {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddJournalEntry = (entry) => {
    setJournalEntries(prev => [...prev, entry])
  }

  const content = {
    dashboard: <Dashboard completedActions={completedActions} journalEntries={journalEntries} />,
    actions: <WeeklyActions completedActions={completedActions} onToggleAction={handleToggleAction} />,
    audit: <CultureAudit auditScores={auditScores} onUpdateScores={setAuditScores} />,
    journal: <Journal journalEntries={journalEntries} onAddEntry={handleAddJournalEntry} />,
    goals: <Goals goals={goals} onUpdateGoals={setGoals} />,
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="glow" />

      {/* ─── Desktop Top Nav ─── */}
      <header className="hidden md:block sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-8 lg:px-12 flex items-center h-[4.25rem]">
          <div className="flex items-center gap-2.5 mr-10 shrink-0">
            <p className="text-[0.55rem] uppercase tracking-[0.3em] text-primary font-semibold">YAU</p>
            <div className="w-px h-5 bg-border" />
            <h1 className="font-display text-[0.9375rem] text-text">Action Planner</h1>
          </div>
          <nav className="flex items-center gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[0.8125rem] font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary/10 text-text'
                      : 'text-text-secondary hover:text-text hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.6} className={active ? 'text-primary' : ''} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3.5 pl-8">
            <span className="text-[0.8rem] font-display text-text-secondary">{overallPercent}%</span>
            <div className="w-28 progress-track">
              <div className="progress-bar" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Desktop Content ─── */}
      <main className="hidden md:block">
        <div className="max-w-[960px] mx-auto px-10 lg:px-14 py-12">
          {content[activeTab]}
        </div>
      </main>

      {/* ─── Mobile Layout ─── */}
      <div className="md:hidden pb-28">
        <div className="px-5 pt-5 pb-4">
          {content[activeTab]}
        </div>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-2xl border-t border-white/[0.06] px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center max-w-lg mx-auto py-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center py-1.5 px-3"
              >
                {active && (
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-primary"
                       style={{ boxShadow: '0 0 10px rgba(255,101,190,0.5)' }} />
                )}
                <Icon
                  size={21}
                  strokeWidth={active ? 2.2 : 1.5}
                  className={`transition-colors ${active ? 'text-primary' : 'text-text-tertiary'}`}
                />
                <span className={`text-[0.6rem] mt-1 font-semibold ${active ? 'text-primary' : 'text-text-tertiary'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App
