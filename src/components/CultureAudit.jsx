import { useState } from 'react'
import { auditCategories, scaleLabels, getRecommendations } from '../data/auditQuestions'

export default function CultureAudit({ auditScores, onUpdateScores }) {
  const [showResults, setShowResults] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(0)

  const allAnswered = auditCategories.every(cat =>
    cat.questions.every(q => auditScores[q.id] > 0)
  )

  const handleScore = (qid, score) => {
    onUpdateScores({ ...auditScores, [qid]: score })
  }

  const results = allAnswered ? getRecommendations(auditScores) : null

  if (showResults && results) {
    const pct = Math.round((results.overall / 5) * 100)
    return (
      <div className="space-y-7 md:space-y-9">
        <div className="pt-2 md:pt-0">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-lime font-semibold mb-2">Results</p>
          <h1 className="font-display text-[1.5rem] md:text-[2rem] text-text">Your Culture Score</h1>
        </div>

        <div className="card-glow p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-cyan/[0.03]" />
          <div className="relative">
            <p className="font-display text-[4.5rem] md:text-[6rem] gradient-text leading-none">{pct}%</p>
            <p className="text-text-secondary text-[0.85rem] mt-4 font-display-italic leading-relaxed max-w-sm mx-auto">
              {pct >= 80 ? "You're thriving! Keep building on your strengths." :
               pct >= 60 ? "You're on your way. A few focused areas will make a big difference." :
               pct >= 40 ? "Good foundation. The weekly actions will help you grow fast." :
               "Everyone starts somewhere. The fact you're here shows real courage."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.recommendations.map((rec, i) => (
            <div key={rec.category} className="card p-5 md:p-7" style={{ animation: `enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{rec.icon}</span>
                <span className="text-[0.875rem] font-semibold text-text flex-1">{rec.category}</span>
                <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  rec.level === 'strong' ? 'bg-success-light text-success' :
                  rec.level === 'building' ? 'bg-orange-light text-orange' :
                  'bg-primary-light text-primary'
                }`}>
                  {rec.level === 'strong' ? 'Strong' : rec.level === 'building' ? 'Building' : 'Focus'}
                </span>
              </div>
              <p className="text-[0.8rem] text-text-secondary leading-relaxed">{rec.message}</p>
            </div>
          ))}
        </div>

        <button onClick={() => { setShowResults(false); setCurrentCategory(0) }} className="btn-secondary w-full py-3.5">
          Retake Audit
        </button>
        <div className="h-4" />
      </div>
    )
  }

  const cat = auditCategories[currentCategory]
  const answered = cat.questions.filter(q => auditScores[q.id] > 0).length

  return (
    <div className="space-y-7 md:space-y-9">
      <div className="pt-2 md:pt-0">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cyan font-semibold mb-2">{cat.icon} {cat.name}</p>
        <h1 className="font-display text-[1.5rem] md:text-[2rem] text-text">Culture Audit</h1>
        <p className="text-text-secondary text-[0.85rem] mt-1.5">Rate your comfort level (1-5)</p>
      </div>

      {/* Category Nav */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {auditCategories.map((c, i) => {
          const done = c.questions.every(q => auditScores[q.id] > 0)
          return (
            <button
              key={c.id}
              onClick={() => setCurrentCategory(i)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl text-[0.7rem] font-semibold whitespace-nowrap transition-all ${
                currentCategory === i
                  ? 'bg-primary text-text-inverse shadow-[0_2px_12px_rgba(255,101,190,0.35)]'
                  : done
                  ? 'bg-success-light text-success'
                  : 'bg-surface-2 text-text-secondary'
              }`}
            >
              {c.icon} {c.name}
            </button>
          )
        })}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="progress-track flex-1">
          <div className="progress-bar" style={{ width: `${((currentCategory * 3 + answered) / 15) * 100}%` }} />
        </div>
        <span className="text-[0.75rem] text-text-secondary font-medium">{currentCategory + 1}/{auditCategories.length}</span>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {cat.questions.map((q, qi) => (
          <div key={q.id} className="card p-5 md:p-7" style={{ animation: `enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${qi * 0.08}s both` }}>
            <p className="text-[0.875rem] md:text-[0.9375rem] text-text mb-5 leading-relaxed">{q.text}</p>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  onClick={() => handleScore(q.id, score)}
                  className={`flex-1 py-3 rounded-xl text-[0.9375rem] font-semibold transition-all duration-200 ${
                    auditScores[q.id] === score
                      ? 'bg-primary text-text-inverse shadow-[0_2px_12px_rgba(255,101,190,0.35)] scale-105'
                      : 'bg-surface-2 text-text-secondary hover:text-text hover:bg-surface-3'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2.5 px-1">
              <span className="text-[0.65rem] text-text-tertiary">{scaleLabels[0]}</span>
              <span className="text-[0.65rem] text-text-tertiary">{scaleLabels[4]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Nav Buttons */}
      <div className="flex gap-4">
        {currentCategory > 0 && (
          <button onClick={() => setCurrentCategory(currentCategory - 1)} className="btn-secondary flex-1 py-3.5">Back</button>
        )}
        {currentCategory < auditCategories.length - 1 ? (
          <button onClick={() => setCurrentCategory(currentCategory + 1)} className="btn-primary flex-1">Next</button>
        ) : allAnswered ? (
          <button onClick={() => setShowResults(true)} className="btn-primary flex-1">See My Results</button>
        ) : (
          <button disabled className="flex-1 py-3.5 rounded-xl text-[0.875rem] font-semibold bg-surface-2 text-text-tertiary cursor-not-allowed">
            Answer all questions
          </button>
        )}
      </div>
      <div className="h-4" />
    </div>
  )
}
