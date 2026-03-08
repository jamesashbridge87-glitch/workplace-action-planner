import { useMemo } from 'react'
import { weeklyActions } from '../data/weeklyActions'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function Dashboard({ completedActions, journalEntries }) {
  const totalActions = weeklyActions.reduce((sum, w) => sum + w.actions.length, 0)
  const completedCount = Object.values(completedActions).filter(Boolean).length
  const pct = Math.round((completedCount / totalActions) * 100)

  const weeks = weeklyActions.map(week => {
    const done = week.actions.filter(a => completedActions[a.id]).length
    return { ...week, done, total: week.actions.length, pct: Math.round((done / week.actions.length) * 100) }
  })

  const confidenceTrend = useMemo(() => {
    if (!journalEntries?.length) return []
    return journalEntries.filter(e => e.confidence).map(e => ({ week: e.week, val: e.confidence }))
  }, [journalEntries])

  const msg = pct === 0
    ? "Ready to start? Every journey begins with a single 'g'day'."
    : pct < 25 ? "You've taken the first steps. Keep going!"
    : pct < 50 ? "Almost halfway. Real momentum building!"
    : pct < 75 ? "Over halfway! You're finding your rhythm."
    : pct < 100 ? "Nearly there. The finish line is close."
    : "You did it! You belong here."

  return (
    <div className="space-y-8 md:space-y-10">

      {/* ── Mobile Header ── */}
      <div className="text-center pt-3 md:hidden">
        <img src="/yau-logo.png" alt="Your Aussie Uncle" className="w-14 h-14 mx-auto mb-3 rounded-xl" />
        <h1 className="font-display text-[1.75rem] text-text leading-tight">
          Workplace<br />
          <span className="font-display-italic gradient-text text-[1.85rem]">Action Planner</span>
        </h1>
        <p className="text-text-secondary text-[0.8rem] mt-3">30 days to workplace confidence</p>
      </div>

      {/* ── Desktop Header ── */}
      <div className="hidden md:flex items-end justify-between">
        <div className="flex items-center gap-4">
          <img src="/yau-logo.png" alt="Your Aussie Uncle" className="w-12 h-12 rounded-xl" />
          <div>
            <h1 className="font-display text-[2.25rem] text-text leading-none">Dashboard</h1>
            <p className="text-text-secondary text-[0.9rem] mt-2">Your progress at a glance</p>
          </div>
        </div>
        <p className="font-display-italic text-text-secondary text-[0.9rem] max-w-xs text-right leading-snug">{msg}</p>
      </div>

      {/* ── Hero Progress ── */}
      <div className="card-glow p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/[0.05] to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan/[0.03] to-transparent rounded-tr-full" />

        <div className="relative">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <p className="text-text-secondary text-[0.7rem] font-semibold uppercase tracking-[0.15em] mb-2">Overall Progress</p>
              <p className="font-display gradient-text leading-none"><span className="text-[3.5rem] md:text-[5rem]">{pct}</span><span className="text-[1.75rem] md:text-[2.5rem]">%</span></p>
            </div>
            <Sparkles size={36} className="text-primary/30 mb-2" strokeWidth={1.2} />
          </div>

          <div className="progress-track progress-track-lg">
            <div className="progress-bar" style={{ width: `${pct}%` }} />
          </div>

          {/* Mobile encouragement */}
          <p className="font-display-italic text-text-secondary text-[0.8rem] mt-5 md:hidden leading-relaxed">{msg}</p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <div className="card p-5 md:p-7 text-center">
          <p className="font-display text-[2rem] md:text-[2.5rem] text-cyan leading-none">{completedCount}</p>
          <p className="text-text-secondary text-[0.65rem] mt-2 font-semibold uppercase tracking-[0.15em]">Done</p>
        </div>
        <div className="card p-5 md:p-7 text-center">
          <p className="font-display text-[2rem] md:text-[2.5rem] text-orange leading-none">{totalActions - completedCount}</p>
          <p className="text-text-secondary text-[0.65rem] mt-2 font-semibold uppercase tracking-[0.15em]">Remaining</p>
        </div>
        <div className="card p-5 md:p-7 text-center hidden md:block">
          <p className="font-display text-[2.5rem] text-lime leading-none">{journalEntries?.length || 0}</p>
          <p className="text-text-secondary text-[0.65rem] mt-2 font-semibold uppercase tracking-[0.15em]">Reflections</p>
        </div>
        <div className="card p-5 md:p-7 text-center hidden md:block">
          <p className="font-display text-[2.5rem] text-primary leading-none">{weeks.filter(w => w.pct === 100).length}</p>
          <p className="text-text-secondary text-[0.65rem] mt-2 font-semibold uppercase tracking-[0.15em]">Weeks Done</p>
        </div>
      </div>

      {/* ── Weekly Progress ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-text-secondary font-semibold">Weekly Progress</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeks.map((w, i) => (
            <div
              key={w.week}
              className="card p-5 md:p-7 flex flex-col gap-4"
              style={{
                animation: `enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both`,
                borderLeftWidth: '3px',
                borderLeftColor: w.pct === 100 ? 'var(--color-success)' : w.pct > 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.04)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[0.75rem] font-bold ${
                    w.pct === 100 ? 'bg-success-light text-success' : 'bg-primary-light text-primary'
                  }`}>
                    {w.pct === 100 ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : `W${w.week}`}
                  </div>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-text">{w.title}</p>
                    <p className="text-[0.75rem] text-text-secondary">{w.done} of {w.total} actions</p>
                  </div>
                </div>
                <span className={`font-display ${w.pct === 100 ? 'text-success' : w.pct > 0 ? 'text-primary' : 'text-text-tertiary'}`}>
                  <span className="text-[1.25rem]">{w.pct}</span><span className="text-[0.75rem]">%</span>
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${w.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confidence Trend ── */}
      {confidenceTrend.length > 0 && (
        <div className="card p-6 md:p-8">
          <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-text-secondary font-semibold mb-6">Confidence Trend</h2>
          <div className="flex items-end gap-4 h-32">
            {confidenceTrend.map((e, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[0.8rem] font-semibold text-text">{e.val}</span>
                <div
                  className="w-full rounded-lg"
                  style={{
                    height: `${(e.val / 10) * 100}%`,
                    background: e.val >= 7 ? 'linear-gradient(to top, #D2FF42, #D2FF4260)' :
                      e.val >= 4 ? 'linear-gradient(to top, #FDA400, #FDA40060)' :
                      'linear-gradient(to top, #FF65BE, #FF65BE60)',
                    transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                <span className="text-[0.65rem] text-text-tertiary font-medium">W{e.week}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
