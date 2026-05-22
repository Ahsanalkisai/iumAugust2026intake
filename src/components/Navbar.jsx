import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Layers, GraduationCap, MessageSquare, Sparkles, Shield, Menu, X } from 'lucide-react'

const NAV = [
  { id: 'home', label: 'Home', icon: Sparkles },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'quiz', label: 'Find My Course', icon: Compass },
  { id: 'browse', label: 'Browse', icon: GraduationCap },
  { id: 'assistant', label: 'Assistant', icon: MessageSquare }
]

export default function Navbar({ active, onNavigate, onAdmin }) {
  const [open, setOpen] = useState(false)
  const go = (id) => { setOpen(false); onNavigate(id) }

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-2.5 sm:mt-3">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3"
        >
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center shadow-glow-cyan">
                <span className="font-display font-extrabold text-navy-900 text-sm sm:text-base">I</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-cyan-glow/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden xs:block">
              <div className="text-xs sm:text-sm font-display font-bold leading-none">IUM</div>
              <div className="text-[9px] sm:text-[10px] text-white/60 leading-none mt-1 tracking-widest uppercase">Intake Guide</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => {
              const Icon = item.icon
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={15} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden xs:flex sm:hidden md:hidden items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-medium text-emerald-300 whitespace-nowrap">Open</span>
            </div>
            <button
              onClick={onAdmin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 hover:text-white border border-white/10 hover:border-cyan-glow/30 transition-all"
              title="Admin"
            >
              <Shield size={13} />
              Admin
            </button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300">Aug 2026 Open</span>
            </div>
            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 grid place-items-center"
              aria-label="Menu"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass-strong rounded-2xl mt-2 p-2"
            >
              <div className="grid gap-1">
                {NAV.map(item => {
                  const Icon = item.icon
                  const isActive = active === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-cyan-glow/10 text-white border border-cyan-glow/30' : 'text-white/75 hover:bg-white/5 border border-transparent'}`}
                    >
                      <Icon size={15} className={isActive ? 'text-cyan-glow' : ''} />
                      {item.label}
                    </button>
                  )
                })}
                <button
                  onClick={() => { setOpen(false); onAdmin() }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-transparent hover:border-white/10 mt-1"
                >
                  <Shield size={15} /> Admin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
