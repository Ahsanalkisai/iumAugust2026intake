import { motion } from 'framer-motion'
import { Award, GraduationCap, BookOpen, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    key: 'Postgraduate',
    title: 'Postgraduate',
    subtitle: 'Master’s & PhD Programmes',
    description: 'Advance your career with research-driven master’s programmes across Shariah, education, business, Qur’an, and languages.',
    Icon: Award,
    gradient: 'from-cyan-glow/30 via-teal-500/20 to-blue-600/20',
    accent: '#22d3ee'
  },
  {
    key: 'Undergraduate',
    title: 'Undergraduate',
    subtitle: 'Bachelor Degrees',
    description: 'Four-year bachelor degrees across law, education, IT, business, psychology, Islamic studies and more.',
    Icon: GraduationCap,
    gradient: 'from-teal-500/30 via-emerald-500/20 to-cyan-glow/20',
    accent: '#2dd4bf'
  },
  {
    key: 'Certificate & Diploma',
    title: 'Certificate & Diploma',
    subtitle: 'Fast-track & Foundation',
    description: 'Short, focused certificates and diplomas — perfect first step or career upskilling pathway.',
    Icon: BookOpen,
    gradient: 'from-gold-400/30 via-amber-500/20 to-orange-500/15',
    accent: '#f5d27a'
  }
]

export default function CategorySection({ programmes, onSelectCategory }) {
  const countOf = (cat) => programmes.filter(p => p.category === cat).length

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-glow/80 mb-3">Programme Levels</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Choose Your <span className="text-gradient">Pathway</span>
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto">Three premium programme tiers — from certificates to PhD — every step of your academic journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.Icon
            const count = countOf(cat.key)
            return (
              <motion.button
                key={cat.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                onClick={() => onSelectCategory?.(cat.key)}
                className="group relative text-left"
              >
                <div className="gradient-border h-full p-8 rounded-3xl overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60`} />
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-40 group-hover:opacity-70 transition-opacity blur-2xl" style={{ background: cat.accent }} />

                  {/* Geo pattern accent */}
                  <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <polygon points="30,4 56,18 56,42 30,56 4,42 4,18" stroke={cat.accent} strokeWidth="1.5" />
                      <polygon points="30,16 44,24 44,38 30,46 16,38 16,24" stroke={cat.accent} strokeWidth="1" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 border border-white/15 mb-5 group-hover:scale-110 transition-transform">
                      <Icon size={26} style={{ color: cat.accent }} />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-white/60 mb-1">{cat.subtitle}</div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">{cat.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-6 min-h-[3rem]">{cat.description}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-extrabold text-3xl text-white">{count}</div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Programmes</div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 group-hover:bg-white/15 text-sm font-medium text-white border border-white/10 transition-colors">
                        Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
