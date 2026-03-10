import { useState } from 'react'

export default function Goals({ goals, onUpdateGoals }) {
  const [vision, setVision] = useState(goals.belongingVision || '')
  const [weeklyGoals, setWeeklyGoals] = useState(goals.weeklyGoals || ['', '', '', '', ''])
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onUpdateGoals({ belongingVision: vision.trim(), weeklyGoals: weeklyGoals.map(g => g.trim()), lastUpdated: new Date().toISOString() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateGoal = (i, val) => {
    const u = [...weeklyGoals]; u[i] = val; setWeeklyGoals(u)
  }

  const prompts = [
    "I want to feel comfortable enough to...",
    "By the end of 30 days, I hope I can...",
    "The moment I'll know I belong is when...",
    "I want my colleagues to see me as..."
  ]

  const weekDesc = [
    "First Days & Foundations. Say g'day, use the 3-Part Intro.",
    "Everyday Conversations. Small talk, emails, meetings.",
    "Social Situations. Lunches, drinks, building relationships.",
    "Professional Conversations. Feedback, requests, difficult chats.",
    "Slang, Humour & Identity. Own your voice. You belong."
  ]

  const placeholders = [
    "e.g., Introduce myself using the 3-Part Intro to 3 new people",
    "e.g., Use the Small Talk Formula in the break room every day",
    "e.g., Go to Friday drinks and stay for at least 30 minutes",
    "e.g., Give feedback using the Feedback Sandwich with a colleague",
    "e.g., Use 5 slang terms naturally in one day"
  ]

  return (
    <div className="space-y-7 md:space-y-9">
      <div className="pt-2 md:pt-0">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-primary font-semibold mb-2">Define Your Why</p>
        <h1 className="font-display text-[1.5rem] md:text-[2rem] text-text">Your Goals</h1>
        <p className="text-text-secondary text-[0.85rem] mt-1.5">What does belonging look like for you?</p>
      </div>

      {/* Vision */}
      <div className="card-glow p-6 md:p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/[0.05] to-transparent rounded-bl-full" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xl">🏠</span>
            <h2 className="text-[0.9375rem] font-bold text-text">Your belonging vision</h2>
          </div>
          <p className="text-[0.8rem] text-text-secondary mb-4 leading-relaxed">
            Close your eyes. Imagine your ideal workday where you feel completely at home. What does that look like?
          </p>
          <textarea value={vision} onChange={e => setVision(e.target.value)}
            placeholder="For me, belonging would look like..."
            className="input" rows={4} />
        </div>
      </div>

      {/* Prompts */}
      <div className="card p-5 md:p-7 space-y-3">
        <p className="text-[0.65rem] text-text-secondary font-semibold uppercase tracking-[0.15em]">Need a spark?</p>
        <div className="space-y-2.5">
          {prompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setVision(prev => prev ? `${prev}\n${p}` : p)}
              className="w-full text-left text-[0.8rem] text-text-secondary bg-surface-2 border border-border rounded-xl p-4 hover:border-cyan hover:text-cyan transition-all leading-relaxed"
              style={{ animation: `enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s both` }}
            >
              <span className="font-display-italic">"{p}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Goals */}
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-text-secondary font-semibold mb-4 px-1">Weekly Goals</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((week, i) => (
            <div key={week} className="card p-5 md:p-7 space-y-3" style={{ animation: `enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both` }}>
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <span className="text-[0.75rem] font-bold text-primary">W{week}</span>
                </div>
                <div>
                  <p className="text-[0.8125rem] font-semibold text-text">Week {week}</p>
                  <p className="text-[0.7rem] text-text-tertiary">{weekDesc[i]}</p>
                </div>
              </div>
              <input
                type="text"
                value={weeklyGoals[i]}
                onChange={e => updateGoal(i, e.target.value)}
                placeholder={placeholders[i]}
                className="input"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-xl text-[0.9375rem] font-semibold transition-all ${
          saved ? 'bg-success text-text-inverse' : 'btn-primary'
        }`}
      >
        {saved ? 'Saved!' : 'Save Goals'}
      </button>

      {goals.lastUpdated && (
        <p className="text-[0.65rem] text-text-tertiary text-center">
          Last saved {new Date(goals.lastUpdated).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
      <div className="h-4" />
    </div>
  )
}
