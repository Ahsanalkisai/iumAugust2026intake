import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Mic, Compass, LayoutGrid, GraduationCap, MessageSquare,
  Sparkles, ArrowRight, MicOff
} from 'lucide-react'
import { INTEREST_CHIPS } from '../data/programmes'

export default function Hero({ onNavigate, onSearch }) {
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)
  const [supportsVoice, setSupportsVoice] = useState(false)
  const recogRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      setSupportsVoice(true)
      const recog = new SR()
      recog.continuous = false
      recog.interimResults = false
      recog.lang = 'en-US'
      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript
        setQuery(transcript)
        onSearch?.(transcript)
        setListening(false)
      }
      recog.onerror = () => setListening(false)
      recog.onend = () => setListening(false)
      recogRef.current = recog
    }
  }, [onSearch])

  const toggleVoice = () => {
    if (!recogRef.current) return
    if (listening) {
      recogRef.current.stop()
      setListening(false)
    } else {
      try { recogRef.current.start(); setListening(true) } catch {}
    }
  }

  const submitSearch = (e) => {
    e?.preventDefault?.()
    if (query.trim()) onSearch?.(query.trim())
  }

  const buttons = [
    { id: 'quiz', label: 'Find My Course', Icon: Compass, primary: true },
    { id: 'browse', label: 'Browse Programmes', Icon: LayoutGrid },
    { id: 'categories', label: 'Explore Faculties', Icon: GraduationCap },
    { id: 'assistant', label: 'Ask Course Assistant', Icon: MessageSquare }
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full text-center">
        {/* Intake Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center mb-8 sm:mb-10"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-glow via-teal-400 to-gold-400 blur-2xl opacity-50 animate-glow-pulse" />
            <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-cyan-glow/40">
              <Sparkles className="text-gold-400 animate-pulse" size={16} />
              <span className="font-display font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-cyan-glow via-white to-gold-400 bg-clip-text text-transparent">
                August 2026 Intake Open
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-cyan" />
            </div>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-extrabold tracking-tight leading-[1.05] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          <span className="block text-white/95">Discover Your</span>
          <span className="block text-gradient">IUM Pathway</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          Explore programmes, compare opportunities, and discover the future that fits you.
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={submitSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <div className="gradient-border p-1.5">
            <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-navy-800/60 backdrop-blur-md">
              <Search size={20} className="text-white/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search programmes, careers, or interests…"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-base sm:text-lg"
              />
              {supportsVoice && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`relative h-11 w-11 rounded-xl grid place-items-center transition-all ${listening ? 'bg-rose-500/20 border border-rose-400/40' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                  title={listening ? 'Listening…' : 'Voice search'}
                >
                  {listening ? <MicOff size={18} className="text-rose-300" /> : <Mic size={18} className="text-cyan-glow" />}
                  {listening && (
                    <span className="absolute inset-0 rounded-xl border-2 border-rose-400/50 animate-ping" />
                  )}
                </button>
              )}
              <button type="submit" className="h-11 px-4 rounded-xl bg-gradient-to-r from-cyan-glow to-teal-500 text-navy-900 font-semibold text-sm hover:shadow-glow-cyan transition-all flex items-center gap-1.5">
                Search <ArrowRight size={15} />
              </button>
            </div>
          </div>
          {listening && (
            <div className="text-xs text-rose-300 mt-2">Listening — speak now…</div>
          )}
        </motion.form>

        {/* Buttons */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}
          className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          {buttons.map(({ id, label, Icon, primary }) => (
            <motion.button
              key={id}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              onClick={() => onNavigate(id)}
              whileHover={{ y: -3 }}
              className={`group relative rounded-2xl overflow-hidden px-4 py-4 transition-all ${primary ? '' : ''}`}
            >
              <div className={`absolute inset-0 ${primary ? 'bg-gradient-to-br from-cyan-glow/20 via-teal-500/15 to-gold-400/10' : 'bg-white/5'} backdrop-blur-sm`} />
              <div className={`absolute inset-0 rounded-2xl border ${primary ? 'border-cyan-glow/50' : 'border-white/10 group-hover:border-cyan-glow/40'} transition-colors`} />
              <div className={`absolute -inset-1 rounded-2xl ${primary ? 'bg-gradient-to-r from-cyan-glow to-teal-500' : 'bg-gradient-to-r from-cyan-glow/40 to-teal-500/40'} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity`} />
              <div className="relative flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl grid place-items-center ${primary ? 'bg-gradient-to-br from-cyan-glow to-teal-500 text-navy-900 shadow-glow-cyan' : 'bg-white/10 text-cyan-glow'}`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm sm:text-base font-semibold">{label}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Popular interest chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-12"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Popular Interests</div>
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
            {INTEREST_CHIPS.map((chip, i) => (
              <motion.button
                key={chip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.04 }}
                whileHover={{ y: -2, scale: 1.04 }}
                onClick={() => onSearch?.(chip)}
                className="chip"
              >
                {chip}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
