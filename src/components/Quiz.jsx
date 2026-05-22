import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Sparkles, Check, RotateCcw, ChevronRight } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'interest',
    title: 'What interests you most?',
    multi: true,
    options: ['Teaching', 'Business', 'Technology', 'Islamic Studies', 'Law', 'Health', 'Arabic', 'Design', 'Communication', 'Research']
  },
  {
    id: 'work',
    title: 'What type of work do you enjoy?',
    multi: true,
    options: ['Helping people', 'Leading teams', 'Solving problems', 'Teaching others', 'Researching', 'Designing', 'Public speaking', 'Managing projects']
  },
  {
    id: 'level',
    title: 'What level are you looking for?',
    multi: false,
    options: ['Certificate', 'Diploma', 'Bachelor', 'Master', 'PhD', 'Not sure']
  },
  {
    id: 'mode',
    title: 'What study mode do you prefer?',
    multi: false,
    options: ['Full-time', 'Part-time', 'Online', 'Hybrid', 'Flexible', 'Not sure']
  },
  {
    id: 'career',
    title: 'What future career sounds interesting?',
    multi: true,
    options: ['Teacher', 'Lecturer', 'Business manager', 'IT professional', 'Lawyer', 'Researcher', 'Religious scholar', 'Designer', 'Project coordinator', 'Public service']
  }
]

const WORK_TO_KEYWORDS = {
  'Helping people': ['psychology', 'counselling', 'teaching', 'health', 'public'],
  'Leading teams': ['management', 'leadership', 'business', 'mba'],
  'Solving problems': ['it', 'technology', 'law', 'research'],
  'Teaching others': ['teaching', 'education', 'pedagogy', 'quran'],
  'Researching': ['research', 'phd', 'master'],
  'Designing': ['design', 'it', 'arts'],
  'Public speaking': ['communication', 'public administration', 'law'],
  'Managing projects': ['project management', 'management', 'business']
}

const CAREER_TO_KEYWORDS = {
  'Teacher': ['teaching', 'education'],
  'Lecturer': ['master', 'phd', 'education', 'research'],
  'Business manager': ['business', 'mba', 'management'],
  'IT professional': ['it', 'technology', 'cyber'],
  'Lawyer': ['law', 'shariah'],
  'Researcher': ['research', 'master', 'phd'],
  'Religious scholar': ['shariah', 'quran', 'islamic'],
  'Designer': ['design', 'arts'],
  'Project coordinator': ['project management', 'management'],
  'Public service': ['public administration', 'governance']
}

const INTEREST_TO_KEYWORDS = {
  'Teaching': ['teaching', 'education'],
  'Business': ['business', 'management', 'finance'],
  'Technology': ['it', 'technology', 'computing', 'cyber'],
  'Islamic Studies': ['islamic', 'shariah', 'quran'],
  'Law': ['law', 'shariah'],
  'Health': ['health', 'psychology'],
  'Arabic': ['arabic', 'language'],
  'Design': ['design', 'arts'],
  'Communication': ['communication', 'language', 'public'],
  'Research': ['research', 'master', 'phd']
}

function scoreProgrammes(programmes, answers) {
  return programmes.map(p => {
    let score = 0
    const reasons = []
    const hay = [
      ...(p.keywords || []),
      ...(p.interests || []).map(s => s.toLowerCase()),
      ...(p.careerPaths || []).map(s => s.toLowerCase()),
      p.programmeName.toLowerCase(),
      p.faculty.toLowerCase()
    ].join(' ')

    // Interests
    const interests = answers.interest || []
    interests.forEach(int => {
      const kws = INTEREST_TO_KEYWORDS[int] || [int.toLowerCase()]
      if (kws.some(k => hay.includes(k))) { score += 3; reasons.push(`Matches interest: ${int}`) }
    })

    // Work styles
    const works = answers.work || []
    works.forEach(w => {
      const kws = WORK_TO_KEYWORDS[w] || []
      if (kws.some(k => hay.includes(k))) { score += 2; reasons.push(`Suits “${w}” work style`) }
    })

    // Career
    const careers = answers.career || []
    careers.forEach(c => {
      const kws = CAREER_TO_KEYWORDS[c] || []
      if (kws.some(k => hay.includes(k))) { score += 3; reasons.push(`Career path: ${c}`) }
    })

    // Level
    const level = answers.level
    if (level && level !== 'Not sure') {
      if (p.level === level) { score += 4; reasons.push(`Matches ${level} level`) }
      else if (level === 'Diploma' && p.level === 'Certificate') score += 1
    } else if (level === 'Not sure') {
      score += 0.5
    }

    // Mode
    const mode = answers.mode
    if (mode && mode !== 'Not sure' && mode !== 'Flexible') {
      if ((p.studyMode || '').toLowerCase().includes(mode.toLowerCase())) {
        score += 2
        reasons.push(`Matches ${mode} mode`)
      }
    } else if (mode === 'Flexible' || mode === 'Not sure') {
      score += 0.3
    }

    // Featured boost
    if (p.featured) score += 0.5

    const maxScore =
      (interests.length || 0) * 3 +
      (works.length || 0) * 2 +
      (careers.length || 0) * 3 +
      4 + 2 + 0.5

    const match = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0

    // Dedup reasons
    const uniqueReasons = [...new Set(reasons)].slice(0, 3)

    return { ...p, _score: score, _match: match, _reasons: uniqueReasons }
  }).sort((a, b) => b._score - a._score)
}

export default function Quiz({ open, onClose, programmes, onViewProgramme, onInterest }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) { setStep(0); setAnswers({}); setDone(false) }
  }, [open])

  const current = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1
  const progress = ((step + (done ? 1 : 0)) / QUESTIONS.length) * 100

  const toggleAnswer = (val) => {
    setAnswers(prev => {
      if (current.multi) {
        const arr = prev[current.id] || []
        const next = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
        return { ...prev, [current.id]: next }
      }
      return { ...prev, [current.id]: val }
    })
  }

  const isAnswered = () => {
    const a = answers[current.id]
    if (current.multi) return Array.isArray(a) && a.length > 0
    return !!a
  }

  const next = () => {
    if (!isAnswered()) return
    if (isLast) setDone(true)
    else setStep(s => s + 1)
  }
  const prev = () => setStep(s => Math.max(0, s - 1))

  const results = useMemo(() => {
    if (!done) return []
    return scoreProgrammes(programmes, answers).slice(0, 3)
  }, [done, programmes, answers])

  const reset = () => { setStep(0); setAnswers({}); setDone(false) }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-navy-900/70 backdrop-blur-xl overflow-y-auto"
        >
          <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-3xl w-full max-w-4xl relative overflow-hidden"
            >
              <button onClick={onClose} className="absolute top-4 right-4 z-20 h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 grid place-items-center transition-colors">
                <X size={18} />
              </button>

              {/* Progress */}
              <div className="px-6 sm:px-10 pt-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-glow/80">
                    <Sparkles size={14} />
                    {done ? 'Your Pathway' : `Question ${step + 1} of ${QUESTIONS.length}`}
                  </div>
                  <div className="text-xs text-white/50">{Math.round(progress)}%</div>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-cyan-glow via-teal-400 to-gold-400 shadow-glow-cyan"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-10 pt-6">
                <AnimatePresence mode="wait">
                  {!done ? (
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35 }}
                    >
                      <h2 className="font-display font-extrabold text-2xl sm:text-4xl mb-2">{current.title}</h2>
                      <p className="text-white/60 text-sm mb-6">{current.multi ? 'Select all that apply.' : 'Pick one option.'}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {current.options.map(opt => {
                          const a = answers[current.id]
                          const selected = current.multi ? (a || []).includes(opt) : a === opt
                          return (
                            <motion.button
                              key={opt}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => toggleAnswer(opt)}
                              className={`relative px-4 py-4 rounded-2xl text-left text-sm font-semibold transition-all overflow-hidden ${selected ? 'border-cyan-glow/60 bg-cyan-glow/10 shadow-glow-cyan' : 'border-white/10 hover:border-cyan-glow/30 bg-white/5 hover:bg-white/10'} border`}
                            >
                              <span className="relative z-10">{opt}</span>
                              {selected && (
                                <motion.span
                                  layoutId={`check-${current.id}-${opt}`}
                                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center"
                                >
                                  <Check size={13} className="text-navy-900" />
                                </motion.span>
                              )}
                              {selected && (
                                <span className="absolute inset-0 bg-gradient-to-br from-cyan-glow/10 to-teal-500/10 pointer-events-none" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <button
                          onClick={prev}
                          disabled={step === 0}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowLeft size={15} /> Back
                        </button>
                        <button
                          onClick={next}
                          disabled={!isAnswered()}
                          className="btn-glow disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isLast ? 'See Results' : 'Next'} <ArrowRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <ResultsView
                      key="results"
                      results={results}
                      onReset={reset}
                      onView={onViewProgramme}
                      onInterest={onInterest}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ResultsView({ results, onReset, onView, onInterest }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Confetti */}
      <div className="relative">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute top-0 left-1/2 w-2 h-3 rounded-sm"
            style={{
              background: ['#22d3ee', '#2dd4bf', '#f5d27a', '#ffffff'][i % 4]
            }}
            initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: [0, 200 + (i % 5) * 30],
              x: [(i - 9) * 18, (i - 9) * 30],
              opacity: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{ duration: 1.8, delay: i * 0.05, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
          className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-glow to-teal-500 shadow-glow-cyan mb-4"
        >
          <Sparkles className="text-navy-900" size={28} />
        </motion.div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">Your Recommended IUM Pathway</h2>
        <p className="text-white/60">Top {results.length} programme matches based on your answers</p>
      </div>

      <div className="space-y-4">
        {results.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="gradient-border p-5 sm:p-6 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <MatchRing percent={p._match} rank={i + 1} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-widest text-cyan-glow/80">{p.category}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">{p.intakeStatus}</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-1">{p.programmeName}</h3>
                <div className="text-xs text-white/60 mb-3">{p.faculty} · {p.duration} · {p.level} · {p.studyMode}</div>
                {p._reasons.length > 0 && (
                  <ul className="space-y-1">
                    {p._reasons.map((r, idx) => (
                      <li key={idx} className="text-sm text-white/75 flex items-center gap-2">
                        <ChevronRight size={13} className="text-cyan-glow flex-shrink-0" /> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button onClick={() => onView?.(p)} className="btn-glow text-sm py-2.5 px-4 w-full">
                  View Details
                </button>
                <button onClick={() => onInterest?.(p)} className="btn-gold text-sm py-2.5 px-4 w-full">
                  I’m Interested
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center">
        <button onClick={onReset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:border-cyan-glow/30 transition-colors">
          <RotateCcw size={15} /> Retake Quiz
        </button>
      </div>
    </motion.div>
  )
}

function MatchRing({ percent, rank }) {
  return (
    <div className="relative h-24 w-24 flex-shrink-0">
      <div className="absolute inset-0 rounded-full ring-progress" style={{ '--p': percent }} />
      <div className="absolute inset-1.5 rounded-full bg-navy-800 grid place-items-center">
        <div className="text-center">
          <div className="font-display font-extrabold text-xl text-white">{percent}%</div>
          <div className="text-[9px] uppercase tracking-widest text-white/50">Match</div>
        </div>
      </div>
      <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 grid place-items-center text-navy-900 text-xs font-extrabold shadow-glow-gold">
        #{rank}
      </div>
    </div>
  )
}
