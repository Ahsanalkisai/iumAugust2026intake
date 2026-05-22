import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, MapPin, Clock, Layers, Calendar, ArrowRight, Filter } from 'lucide-react'

const STATUS_STYLES = {
  'Open': 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  'Closing Soon': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  'Closed': 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  'Coming Soon': 'bg-violet-500/15 text-violet-300 border-violet-400/30'
}

export default function BrowseProgrammes({ programmes, query, setQuery, initialFilters, onView, onInterest }) {
  const [filters, setFilters] = useState({
    category: 'All',
    faculty: 'All',
    level: 'All',
    studyMode: 'All',
    campus: 'All',
    intakeStatus: 'All'
  })
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (initialFilters) {
      setFilters(f => ({ ...f, ...initialFilters }))
    }
  }, [initialFilters])

  const unique = (key) => ['All', ...new Set(programmes.map(p => p[key]).filter(Boolean))]
  const facets = useMemo(() => ({
    category: unique('category'),
    faculty: unique('faculty'),
    level: unique('level'),
    studyMode: unique('studyMode'),
    campus: unique('campus'),
    intakeStatus: unique('intakeStatus')
  }), [programmes])

  const results = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    return programmes.filter(p => {
      if (filters.category !== 'All' && p.category !== filters.category) return false
      if (filters.faculty !== 'All' && p.faculty !== filters.faculty) return false
      if (filters.level !== 'All' && p.level !== filters.level) return false
      if (filters.studyMode !== 'All' && p.studyMode !== filters.studyMode) return false
      if (filters.campus !== 'All' && p.campus !== filters.campus) return false
      if (filters.intakeStatus !== 'All' && p.intakeStatus !== filters.intakeStatus) return false
      if (q) {
        const hay = [p.programmeName, p.faculty, p.category, p.description, ...(p.keywords || []), ...(p.interests || []), ...(p.careerPaths || [])].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [programmes, query, filters])

  const activeFilterCount = Object.values(filters).filter(v => v !== 'All').length + (query ? 1 : 0)

  const clearAll = () => {
    setFilters({ category: 'All', faculty: 'All', level: 'All', studyMode: 'All', campus: 'All', intakeStatus: 'All' })
    setQuery?.('')
  }

  return (
    <section id="browse" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-glow/80 mb-3">All Programmes</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl">Browse <span className="text-gradient">Programmes</span></h2>
          <p className="mt-2 text-white/60">{programmes.length} programmes — search, filter, and find your fit.</p>
        </motion.div>

        {/* Search & filter bar */}
        <div className="gradient-border p-1.5 mb-4">
          <div className="rounded-2xl bg-navy-800/60 backdrop-blur-md p-3 flex flex-col lg:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search size={18} className="text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery?.(e.target.value)}
                placeholder="Search programme, faculty, career…"
                className="flex-1 bg-transparent outline-none py-2 text-white placeholder-white/40"
              />
              {query && (
                <button onClick={() => setQuery?.('')} className="p-1 text-white/40 hover:text-white"><X size={15} /></button>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${filtersOpen ? 'border-cyan-glow/50 bg-cyan-glow/10 text-white' : 'border-white/10 bg-white/5 text-white/80'}`}
            >
              <Filter size={15} /> Filters {activeFilterCount > 0 && <span className="ml-1 text-xs bg-cyan-glow text-navy-900 px-1.5 rounded-full">{activeFilterCount}</span>}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white">
                <X size={13} /> Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className={`mb-8 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              ['Category', 'category'],
              ['Faculty', 'faculty'],
              ['Level', 'level'],
              ['Study Mode', 'studyMode'],
              ['Campus', 'campus'],
              ['Intake', 'intakeStatus']
            ].map(([label, key]) => (
              <FilterSelect
                key={key}
                label={label}
                value={filters[key]}
                options={facets[key]}
                onChange={(v) => setFilters(f => ({ ...f, [key]: v }))}
              />
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white/60">
            <span className="font-bold text-white">{results.length}</span> {results.length === 1 ? 'programme' : 'programmes'} found
          </div>
        </div>

        {/* Grid */}
        {results.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-display font-bold text-xl mb-2">No programmes match your filters</h3>
            <p className="text-white/60 mb-4">Try widening your search or clearing filters.</p>
            <button onClick={clearAll} className="btn-glow">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                >
                  <ProgrammeCard p={p} onView={onView} onInterest={onInterest} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 ml-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none hover:bg-white/10 focus:border-cyan-glow/50 transition-colors"
        >
          {options.map(o => <option key={o} value={o} className="bg-navy-700">{o}</option>)}
        </select>
        <SlidersHorizontal size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40" />
      </div>
    </div>
  )
}

export function ProgrammeCard({ p, onView, onInterest }) {
  const statusCls = STATUS_STYLES[p.intakeStatus] || STATUS_STYLES['Open']
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative h-full"
    >
      <div className="gradient-border h-full p-6 rounded-3xl flex flex-col relative overflow-hidden">
        {/* glow on hover */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ background: 'radial-gradient(circle at 50% 0%, rgba(34,211,238,0.18), transparent 60%)' }} />

        <div className="flex items-center gap-2 mb-3 relative z-10">
          <span className="text-[10px] uppercase tracking-widest text-cyan-glow/80">{p.category}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusCls}`}>{p.intakeStatus}</span>
          {p.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-400/15 text-gold-400 border border-gold-400/30">★ Featured</span>}
        </div>

        <h3 className="font-display font-bold text-lg sm:text-xl leading-tight mb-2 relative z-10">{p.programmeName}</h3>
        <div className="text-xs text-white/55 mb-4 relative z-10">{p.faculty}</div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs relative z-10">
          <Meta icon={Layers} label={p.level} />
          <Meta icon={Clock} label={p.duration} />
          <Meta icon={MapPin} label={p.campus} />
          <Meta icon={Calendar} label={p.studyMode} />
        </div>

        <div className="text-xs text-white/65 mb-4 line-clamp-2 relative z-10">{p.description}</div>

        <div className="mt-auto flex flex-col gap-2 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">Fee</div>
              <div className="font-display font-bold text-sm text-white">{p.fee}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Intake</div>
              <div className="font-display font-bold text-sm text-white">{p.intake}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onView?.(p)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-glow/30 transition-all">
              View Details <ArrowRight size={14} />
            </button>
            <button onClick={() => onInterest?.(p)} className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 hover:shadow-glow-gold transition-all">
              I’m Interested
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Meta({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 text-white/65">
      <Icon size={12} className="text-cyan-glow flex-shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  )
}
