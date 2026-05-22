import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Bot, X, Zap, ArrowRight } from 'lucide-react'

const SUGGESTIONS = [
  'Which programmes are part-time?',
  'What can I study in business?',
  'Which programmes are related to Qur’an?',
  'Which programmes are postgraduate?',
  'Can I study while working?',
  'What is suitable for teaching?'
]

function answerQuery(query, programmes) {
  const q = query.toLowerCase()
  const has = (...words) => words.some(w => q.includes(w))

  let intro = ''
  let matches = []

  if (has('part-time', 'part time', 'work', 'evening')) {
    matches = programmes.filter(p => /part-time/i.test(p.studyMode))
    intro = matches.length
      ? `Here are programmes you can take while working — flexible part-time options across IUM:`
      : `I couldn’t find part-time options right now. Try browsing all programmes.`
  } else if (has('online', 'remote')) {
    matches = programmes.filter(p => /online/i.test(p.studyMode) || /online/i.test(p.campus))
    intro = `Online and remote-friendly programmes:`
  } else if (has('hybrid', 'mixed')) {
    matches = programmes.filter(p => /hybrid/i.test(p.studyMode))
    intro = `Hybrid programmes blending online and on-campus:`
  } else if (has('postgrad', 'master', 'mba', 'phd')) {
    matches = programmes.filter(p => p.category === 'Postgraduate')
    intro = `Postgraduate programmes — master’s and PhD level:`
  } else if (has('undergrad', 'bachelor', 'degree')) {
    matches = programmes.filter(p => p.category === 'Undergraduate')
    intro = `Undergraduate (Bachelor) programmes:`
  } else if (has('certificate', 'diploma', 'short')) {
    matches = programmes.filter(p => p.category === 'Certificate & Diploma')
    intro = `Certificate and diploma programmes — perfect for fast-track or foundation:`
  } else if (has('business', 'mba', 'management', 'finance', 'banking', 'entrepreneur')) {
    matches = programmes.filter(p => /business|management|mba|finance|banking|economics/i.test(`${p.programmeName} ${p.faculty} ${p.keywords?.join(' ')}`))
    intro = `Business-related programmes at IUM:`
  } else if (has('it', 'technology', 'computer', 'software', 'tech')) {
    matches = programmes.filter(p => /it|technology|computing|software|cyber/i.test(`${p.programmeName} ${p.keywords?.join(' ')}`))
    intro = `Technology & IT programmes:`
  } else if (has('quran', 'qur’an', 'qiraat', 'tajweed', 'tafsir')) {
    matches = programmes.filter(p => /quran|qur’an|qiraat|tafsir|tajweed/i.test(`${p.programmeName} ${p.keywords?.join(' ')}`))
    intro = `Programmes related to the Qur’an:`
  } else if (has('law', 'legal', 'shariah', 'fiqh')) {
    matches = programmes.filter(p => /law|shariah|legal|fiqh/i.test(`${p.programmeName} ${p.keywords?.join(' ')}`))
    intro = `Law and Shariah programmes:`
  } else if (has('teach', 'education', 'school')) {
    matches = programmes.filter(p => /teaching|education/i.test(`${p.programmeName} ${p.keywords?.join(' ')}`))
    intro = `Programmes for those who want to teach:`
  } else if (has('arabic')) {
    matches = programmes.filter(p => /arabic/i.test(`${p.programmeName} ${p.keywords?.join(' ')}`))
    intro = `Arabic language programmes:`
  } else if (has('psychology', 'counsel', 'mental')) {
    matches = programmes.filter(p => /psychology|counsel/i.test(`${p.programmeName} ${p.keywords?.join(' ')}`))
    intro = `Psychology and counselling programmes:`
  } else if (has('project', 'management')) {
    matches = programmes.filter(p => /project|management/i.test(`${p.programmeName} ${p.keywords?.join(' ')}`))
    intro = `Project & management focused programmes:`
  } else if (has('open', 'intake', 'apply', 'august')) {
    matches = programmes.filter(p => p.intakeStatus === 'Open' || p.intakeStatus === 'Closing Soon').slice(0, 6)
    intro = `Programmes currently open for the August 2026 intake:`
  } else if (has('hello', 'hi', 'salam', 'assalam', 'hey')) {
    return {
      text: `Assalam alaikum! I’m your IUM course assistant. Ask me about programmes, modes of study, or careers — for example, “Which programmes are part-time?” or “What can I study in business?”`,
      matches: []
    }
  } else {
    // Fallback keyword search
    matches = programmes.filter(p => {
      const hay = `${p.programmeName} ${p.faculty} ${p.description} ${(p.keywords||[]).join(' ')} ${(p.careerPaths||[]).join(' ')} ${(p.interests||[]).join(' ')}`.toLowerCase()
      return q.split(/\s+/).filter(w => w.length > 2).some(w => hay.includes(w))
    })
    intro = matches.length
      ? `Here’s what I found that matches your question:`
      : `I couldn’t find an exact match. Try one of the suggestions, or browse all programmes.`
  }

  return { text: intro, matches: matches.slice(0, 4) }
}

export default function CourseAssistant({ open, onClose, programmes, onViewProgramme }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Assalam alaikum 👋 — I’m your IUM course assistant. Ask me anything about programmes, study modes, or careers.' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [open, messages, typing])

  const send = (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setTyping(true)
    setTimeout(() => {
      const a = answerQuery(q, programmes)
      setTyping(false)
      setMessages(m => [...m, { role: 'bot', text: a.text, matches: a.matches }])
    }, 700 + Math.random() * 400)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-navy-900/70 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="glass-strong rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[88vh] sm:h-[80vh] flex flex-col relative overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center shadow-glow-cyan">
                    <Bot className="text-navy-900" size={20} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-navy-800 animate-pulse" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm">IUM Course Assistant</div>
                  <div className="text-[11px] text-white/55 flex items-center gap-1"><Zap size={9} className="text-emerald-400" /> Online · Powered by IUM data</div>
                </div>
              </div>
              <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 grid place-items-center">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <Message key={i} m={m} onView={onViewProgramme} />
              ))}
              {typing && (
                <div className="flex items-end gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center flex-shrink-0">
                    <Bot size={14} className="text-navy-900" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-5 pb-2">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1">
                  <Sparkles size={10} /> Try asking
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)} className="chip text-xs py-1.5 px-3">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="p-4 border-t border-white/10 flex items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-cyan-glow/50 transition-colors">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about programmes, careers, modes…"
                  className="flex-1 bg-transparent outline-none text-sm placeholder-white/40"
                />
              </div>
              <button type="submit" disabled={!input.trim()} className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center text-navy-900 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow-cyan transition-all">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Message({ m, onView }) {
  const isUser = m.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center flex-shrink-0">
          <Bot size={14} className="text-navy-900" />
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${isUser ? 'bg-gradient-to-br from-cyan-glow to-teal-500 text-navy-900 rounded-br-md font-medium' : 'bg-white/5 border border-white/10 rounded-bl-md'}`}>
          {m.text}
        </div>
        {m.matches?.length > 0 && (
          <div className="space-y-1.5 w-full">
            {m.matches.map(p => (
              <button
                key={p.id}
                onClick={() => onView?.(p)}
                className="w-full text-left p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-glow/40 transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-cyan-glow/80 mb-0.5">{p.category}</div>
                    <div className="font-semibold text-sm truncate">{p.programmeName}</div>
                    <div className="text-[11px] text-white/55 truncate">{p.faculty} · {p.duration}</div>
                  </div>
                  <ArrowRight size={14} className="text-cyan-glow flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
