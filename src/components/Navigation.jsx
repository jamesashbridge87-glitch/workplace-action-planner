import { LayoutDashboard, ListChecks, Compass, BookOpen, Target } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'actions', label: 'Actions', icon: ListChecks },
  { id: 'audit', label: 'Audit', icon: Compass },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'goals', label: 'Goals', icon: Target },
]

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="nav-bar fixed bottom-0 left-0 right-0 z-50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center max-w-lg mx-auto py-1.5">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center py-2 px-3 transition-all duration-200"
            >
              {isActive && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-primary"
                     style={{ boxShadow: '0 0 12px rgba(255, 101, 190, 0.5)' }} />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.6}
                className={`transition-all duration-200 ${isActive ? 'text-primary' : 'text-text-light'}`}
              />
              <span className={`text-[0.6rem] mt-1 font-semibold tracking-wide transition-colors ${
                isActive ? 'text-primary' : 'text-text-light'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
