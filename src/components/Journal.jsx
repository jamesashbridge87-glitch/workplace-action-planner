import { useState } from 'react'

export default function Journal({ journalEntries, onAddEntry }) {
  const nextWeek = journalEntries.length > 0 ? journalEntries.length + 1 : 1
  const [currentWeek] = useState(nextWeek)
  const [wentWell, setWentWell] = useState('')
  const [awkward, setAwkward] = useState('')
  const [tryNext, setTryNext] = useState('')
  const [confidence, setConfidence] = useState(5)
  const [showPast, setShowPast] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = () => {
    if (!wentWell.trim()) return
    onAddEntry({ week: currentWeek, date: new Date().toISOString(), wentWell: wentWell.trim(), awkward: awkward.trim(), tryNext: tryNext.trim(), confidence })
    setSaved(true)
    setTimeout(() => { setWentWell(''); setAwkward(''); setTryNext(''); setConfidence(5); setSaved(false) }, 2000)
  }

  const emoji = confidence >= 8 ? '🔥' : confidence >= 6 ? '🌱' : confidence >= 4 ? '💪' : '🫶'
  const confColor = confidence >= 7 ? 'text-success' : confidence >= 4 ? 'text-orange' : 'text-primary'

  return (
    <div className="space-y-7 md:space-y-9">
      <div className="pt-2 md:pt-0">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-orange font-semibold mb-2">Reflect</p>
        <h1 className="font-display text-[1.5rem] md:text-[2rem] text-text">Weekly Journal</h1>
        <p className="text-text-secondary text-[0.85rem] mt-1.5">A few minutes to reflect on your growth</p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 p-1.5 bg-surface rounded-2xl">
        <button
          onClick={() => setShowPast(false)}
          className={`flex-1 py-3 rounded-xl text-[0.8125rem] font-semibold transition-all ${
            !showPast ? 'bg-primary text-text-inverse shadow-[0_2px_12px_rgba(255,101,190,0.35)]' : 'text-text-secondary'
          }`}
        >
          New Entry
        </button>
        <button
          onClick={() => setShowPast(true)}
          className={`flex-1 py-3 rounded-xl text-[0.8125rem] font-semibold transition-all ${
            showPast ? 'bg-primary text-text-inverse shadow-[0_2px_12px_rgba(255,101,190,0.35)]' : 'text-text-secondary'
          }`}
        >
          Past ({journalEntries.length})
        </button>
      </div>

      {showPast ? (
        <div className="space-y-4">
          {journalEntries.length === 0 ? (
            <div className="card p-10 md:p-14 text-center">
              <p className="font-display text-[2rem] mb-3 opacity-30">📝</p>
              <p className="text-text-secondary text-[0.85rem] font-display-italic">No entries yet. Complete your first week and reflect on it!</p>
            </div>
          ) : (
            [...journalEntries].reverse().map((entry, i) => (
              <div key={i} className="card p-5 md:p-7 space-y-4" style={{ animation: `enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both` }}>
                <div className="flex items-center justify-between">
                  <span className="text-[0.8rem] font-bold text-cyan">Week {entry.week}</span>
                  <span className="text-[0.7rem] text-text-tertiary">
                    {new Date(entry.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[0.7rem] text-text-secondary font-medium">Confidence</span>
                  <div className="flex gap-[3px] flex-1">
                    {[...Array(10)].map((_, j) => (
                      <div key={j} className={`h-2.5 flex-1 rounded-full ${
                        j < entry.confidence
                          ? entry.confidence >= 7 ? 'bg-success' : entry.confidence >= 4 ? 'bg-orange' : 'bg-primary'
                          : 'bg-white/[0.06]'
                      }`} />
                    ))}
                  </div>
                  <span className="text-[0.8rem] font-bold text-text">{entry.confidence}</span>
                </div>
                {entry.wentWell && (
                  <div className="bg-success-light/50 rounded-xl p-4">
                    <p className="text-[0.65rem] text-success font-bold uppercase tracking-wider mb-1">Went well</p>
                    <p className="text-[0.8rem] text-text-secondary leading-relaxed">{entry.wentWell}</p>
                  </div>
                )}
                {entry.awkward && (
                  <div className="bg-orange-light/50 rounded-xl p-4">
                    <p className="text-[0.65rem] text-orange font-bold uppercase tracking-wider mb-1">Felt awkward</p>
                    <p className="text-[0.8rem] text-text-secondary leading-relaxed">{entry.awkward}</p>
                  </div>
                )}
                {entry.tryNext && (
                  <div className="bg-cyan-light/50 rounded-xl p-4">
                    <p className="text-[0.65rem] text-cyan font-bold uppercase tracking-wider mb-1">Try next week</p>
                    <p className="text-[0.8rem] text-text-secondary leading-relaxed">{entry.tryNext}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card p-5 md:p-7 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-light flex items-center justify-center text-lg">📝</div>
            <div>
              <p className="text-[0.9375rem] font-semibold text-text">Week {currentWeek} Reflection</p>
              <p className="text-[0.75rem] text-text-secondary">Take your time. No wrong answers.</p>
            </div>
          </div>

          <div className="card p-5 md:p-7 space-y-3">
            <label className="text-[0.7rem] font-bold text-success uppercase tracking-wider">What went well this week?</label>
            <textarea value={wentWell} onChange={e => setWentWell(e.target.value)}
              placeholder="Maybe you made someone laugh, or joined a conversation you normally wouldn't..."
              className="input" rows={3} />
          </div>

          <div className="card p-5 md:p-7 space-y-3">
            <label className="text-[0.7rem] font-bold text-orange uppercase tracking-wider">What felt awkward?</label>
            <textarea value={awkward} onChange={e => setAwkward(e.target.value)}
              placeholder="It's okay if things felt weird. That's how growth works..."
              className="input" rows={3} />
          </div>

          <div className="card p-5 md:p-7 space-y-3">
            <label className="text-[0.7rem] font-bold text-cyan uppercase tracking-wider">What will I try differently?</label>
            <textarea value={tryNext} onChange={e => setTryNext(e.target.value)}
              placeholder="One small thing you want to push yourself on..."
              className="input" rows={3} />
          </div>

          <div className="card p-5 md:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-[0.9375rem] font-semibold text-text">My confidence this week</label>
              <div className="flex items-center gap-2">
                <span className="text-xl">{emoji}</span>
                <span className={`font-display text-[1.5rem] ${confColor}`}>{confidence}</span>
              </div>
            </div>
            <input type="range" min="1" max="10" value={confidence} onChange={e => setConfidence(parseInt(e.target.value))} />
            <div className="flex justify-between">
              <span className="text-[0.65rem] text-text-tertiary">Not confident</span>
              <span className="text-[0.65rem] text-text-tertiary">Very confident</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!wentWell.trim()}
            className={`w-full py-4 rounded-xl text-[0.9375rem] font-semibold transition-all ${
              saved ? 'bg-success text-text-inverse'
              : wentWell.trim() ? 'btn-primary' : 'bg-surface-2 text-text-tertiary cursor-not-allowed'
            }`}
          >
            {saved ? 'Saved!' : 'Save Reflection'}
          </button>
        </div>
      )}
      <div className="h-4" />
    </div>
  )
}
