import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ExternalLink, Download, Send, Clock, MapPin, Layers, Calendar, GraduationCap,
  CheckCircle2, Star, BookOpen, Briefcase, Award, Users, FileText, Sparkles
} from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'requirements', label: 'Requirements', icon: CheckCircle2 },
  { id: 'careers', label: 'Careers', icon: Briefcase },
  { id: 'related', label: 'Related', icon: Sparkles }
]

export default function ProgrammeModal({ programme, allProgrammes, onClose, onInterest }) {
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (programme) {
      setTab('overview')
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [programme])

  const related = programme
    ? allProgrammes
        .filter(p => p.id !== programme.id && (
          p.faculty === programme.faculty ||
          p.category === programme.category ||
          (p.interests || []).some(i => (programme.interests || []).includes(i))
        ))
        .slice(0, 4)
    : []

  return (
    <AnimatePresence>
      {programme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-navy-900/70 backdrop-blur-xl overflow-y-auto"
        >
          <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-6">
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="glass-strong rounded-3xl w-full max-w-4xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="relative px-6 sm:px-8 pt-8 pb-5 border-b border-white/10">
                <div className="absolute top-4 right-4 z-20">
                  <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 grid place-items-center transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-glow to-teal-500 blur-3xl" />
                </div>
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-widest text-cyan-glow/80">{programme.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">{programme.intakeStatus}</span>
                    {programme.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-gold-400/15 text-gold-400 border border-gold-400/30 inline-flex items-center gap-1"><Star size={11} /> Featured</span>}
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl pr-12">{programme.programmeName}</h2>
                  <div className="text-sm text-white/65 mt-1">{programme.faculty}</div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-6 sm:px-8 py-5 border-b border-white/10">
                <Stat icon={Layers} label="Level" value={programme.level} />
                <Stat icon={Clock} label="Duration" value={programme.duration} />
                <Stat icon={Calendar} label="Mode" value={programme.studyMode} />
                <Stat icon={MapPin} label="Campus" value={programme.campus} />
              </div>

              {/* Tabs */}
              <div className="px-6 sm:px-8 pt-5">
                <div className="flex gap-1 border-b border-white/10 overflow-x-auto -mx-1 px-1">
                  {TABS.map(t => {
                    const Icon = t.icon
                    const active = tab === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`relative px-4 py-2.5 text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${active ? 'text-white' : 'text-white/55 hover:text-white/80'}`}
                      >
                        <Icon size={14} />
                        {t.label}
                        {active && (
                          <motion.span layoutId="modalTab" className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-glow to-teal-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 py-6 max-h-[55vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab === 'overview' && (
                      <div className="space-y-5">
                        <section>
                          <SectionTitle icon={FileText}>About this programme</SectionTitle>
                          <p className="text-white/75 leading-relaxed">{programme.description}</p>
                        </section>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <InfoBox label="Fee" value={programme.fee} accent="#f5d27a" />
                          <InfoBox label="Intake" value={programme.intake} accent="#22d3ee" />
                          <InfoBox label="Seats" value={programme.seats?.toString() || '—'} accent="#2dd4bf" />
                          <InfoBox label="Faculty" value={programme.faculty} accent="#22d3ee" />
                        </div>
                        {programme.skills?.length > 0 && (
                          <section>
                            <SectionTitle icon={Award}>Skills you’ll gain</SectionTitle>
                            <div className="flex flex-wrap gap-2">
                              {programme.skills.map(s => (
                                <span key={s} className="px-3 py-1.5 rounded-full text-xs bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30">{s}</span>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>
                    )}

                    {tab === 'requirements' && (
                      <div className="space-y-5">
                        <SectionTitle icon={CheckCircle2}>Entry requirements</SectionTitle>
                        <ul className="space-y-2">
                          {(programme.entryRequirements || []).map((r, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                              <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
                              <span className="text-sm text-white/80">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {tab === 'careers' && (
                      <div className="space-y-5">
                        {programme.careerPaths?.length > 0 && (
                          <section>
                            <SectionTitle icon={Briefcase}>Career paths</SectionTitle>
                            <div className="grid grid-cols-2 gap-2">
                              {programme.careerPaths.map(c => (
                                <div key={c} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-glow/30 transition-colors">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-glow/30 to-teal-500/30 grid place-items-center">
                                      <Briefcase size={14} className="text-cyan-glow" />
                                    </div>
                                    <span className="text-sm font-medium">{c}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                        {programme.interests?.length > 0 && (
                          <section>
                            <SectionTitle icon={Users}>Related interests</SectionTitle>
                            <div className="flex flex-wrap gap-2">
                              {programme.interests.map(i => (
                                <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-gold-400/10 text-gold-400 border border-gold-400/30">{i}</span>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>
                    )}

                    {tab === 'related' && (
                      <div className="space-y-3">
                        <SectionTitle icon={Sparkles}>Related programmes</SectionTitle>
                        {related.length === 0 ? (
                          <p className="text-white/60 text-sm">No related programmes yet.</p>
                        ) : (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {related.map(r => (
                              <div key={r.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-glow/30 transition-colors">
                                <div className="text-[10px] uppercase tracking-widest text-cyan-glow/80 mb-1">{r.category}</div>
                                <div className="font-semibold text-sm mb-1">{r.programmeName}</div>
                                <div className="text-xs text-white/55">{r.duration} · {r.level}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action bar */}
              <div className="px-6 sm:px-8 py-5 border-t border-white/10 flex flex-col sm:flex-row gap-2 bg-navy-900/40">
                <button onClick={() => onInterest?.(programme)} className="btn-gold flex-1">
                  <Send size={15} /> I’m Interested
                </button>
                {programme.applyLink && (
                  <a href={programme.applyLink} target="_blank" rel="noreferrer" className="btn-glow flex-1">
                    Apply Now <ExternalLink size={14} />
                  </a>
                )}
                {programme.brochureLink && (
                  <a href={programme.brochureLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    <Download size={14} /> Brochure
                  </a>
                )}
                {programme.officialPageLink && (
                  <a href={programme.officialPageLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    Official <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/50 mb-0.5">
        <Icon size={11} className="text-cyan-glow" /> {label}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  )
}

function SectionTitle({ children, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={15} className="text-cyan-glow" />}
      <h3 className="text-xs uppercase tracking-widest text-white/60 font-semibold">{children}</h3>
    </div>
  )
}

function InfoBox({ label, value, accent }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-1" style={{ background: accent }} />
      <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{label}</div>
      <div className="font-display font-bold text-white">{value}</div>
    </div>
  )
}
