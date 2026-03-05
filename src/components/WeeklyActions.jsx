import { useState } from 'react'
import { weeklyActions } from '../data/weeklyActions'
import { Lightbulb } from 'lucide-react'

export default function WeeklyActions({ completedActions, onToggleAction }) {
  const [activeWeek, setActiveWeek] = useState(1)
  const [showTip, setShowTip] = useState(null)
  const [justChecked, setJustChecked] = useState(null)

  const week = weeklyActions.find(w => w.week === activeWeek)
  const done = week.actions.filter(a => completedActions[a.id]).length
  const total = week.actions.length
  const pct = Math.round((done / total) * 100)

  const handleToggle = (id) => {
    onToggleAction(id)
    if (!completedActions[id]) {
      setJustChecked(id)
      setTimeout(() => setJustChecked(null), 600)
    }
  }

  return (
    <div className="space-y-7 md:space-y-9">

      {/* Header */}
      <div className="pt-2 md:pt-0">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cyan font-semibold mb-2">Week {activeWeek} of 4</p>
        <h1 className="font-display text-[1.5rem] md:text-[2rem] text-text">{week.title}</h1>
        <p className="text-text-secondary text-[0.85rem] mt-1.5 font-display-italic">{week.subtitle}</p>
      </div>

      {/* Week Tabs + Progress */}
      <div className="card p-5 md:p-7 space-y-5">
        <div className="flex gap-2.5">
          {weeklyActions.map(w => {
            const wDone = w.actions.filter(a => completedActions[a.id]).length
            const allDone = wDone === w.actions.length
            const active = activeWeek === w.week
            return (
              <button
                key={w.week}
                onClick={() => setActiveWeek(w.week)}
                className={`flex-1 py-3 rounded-xl text-[0.8125rem] font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-primary text-text-inverse shadow-[0_2px_12px_rgba(255,101,190,0.35)]'
                    : allDone
                    ? 'bg-success-light text-success'
                    : 'bg-surface-2 text-text-secondary hover:text-text'
                }`}
              >
                W{w.week}
                {allDone && !active && (
                  <svg className="w-3 h-3 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[0.8rem] text-text-secondary">Progress</span>
            <span className="font-display text-[1.125rem] text-primary">{done}/{total}</span>
          </div>
          <div className="progress-track progress-track-lg">
            <div className="progress-bar" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {pct === 100 && (
          <p className="text-success text-[0.85rem] font-semibold text-center" style={{ animation: 'celebrate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            Week {activeWeek} complete! You legend!
          </p>
        )}
      </div>

      {/* Action Items */}
      <div className="space-y-3">
        {week.actions.map((action, i) => {
          const checked = completedActions[action.id]
          const popped = justChecked === action.id
          return (
            <div
              key={action.id}
              className={`card overflow-hidden transition-all duration-300 ${checked ? 'opacity-50' : ''}`}
              style={{ animation: `enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s both` }}
            >
              <div className="flex items-start gap-4 p-5 md:p-6">
                <div
                  onClick={() => handleToggle(action.id)}
                  className={`check mt-0.5 ${checked ? 'done' : ''}`}
                  style={popped ? { animation: 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' } : {}}
                >
                  {checked && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className={`text-[0.875rem] md:text-[0.9375rem] flex-1 leading-relaxed ${checked ? 'text-text-secondary line-through' : 'text-text'}`}>
                  {action.text}
                </p>
                <button
                  onClick={() => setShowTip(showTip === action.id ? null : action.id)}
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    showTip === action.id ? 'bg-cyan-light text-cyan' : 'text-text-tertiary hover:text-cyan hover:bg-cyan-light'
                  }`}
                >
                  <Lightbulb size={17} strokeWidth={1.8} />
                </button>
              </div>
              {showTip === action.id && (
                <div className="px-5 pb-5 md:px-6 md:pb-6" style={{ animation: 'enter 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div className="bg-cyan-light/40 border-l-[3px] border-cyan rounded-r-xl p-4">
                    <p className="text-[0.8rem] md:text-[0.85rem] text-cyan leading-relaxed">{action.tip}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="h-4" />
    </div>
  )
}
