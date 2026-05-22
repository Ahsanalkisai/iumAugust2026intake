import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Lock, LayoutDashboard, GraduationCap, Users, Building2, Settings as Cog,
  Plus, Pencil, Trash2, Download, Upload, Search, Star, CheckCircle2, Shield
} from 'lucide-react'
import { loadLeads, saveLeads } from './InterestForm'
import { FACULTIES } from '../data/programmes'

const PASSKEY = 'ium2026'
const LS_PROGRAMMES = 'ium_programmes_override'
const LS_AUTH = 'ium_admin_session'

export function loadProgrammesOverride(defaultProgrammes) {
  try {
    const stored = localStorage.getItem(LS_PROGRAMMES)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultProgrammes
}
export function saveProgrammesOverride(arr) {
  localStorage.setItem(LS_PROGRAMMES, JSON.stringify(arr))
}
export function resetProgrammesOverride() {
  localStorage.removeItem(LS_PROGRAMMES)
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'programmes', label: 'Programmes', icon: GraduationCap },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'faculties', label: 'Faculties', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Cog }
]

export default function AdminDashboard({ open, onClose, programmes, setProgrammes, defaultProgrammes }) {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [tab, setTab] = useState('overview')
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setError('')
      setPass('')
      const session = sessionStorage.getItem(LS_AUTH)
      if (session === '1') setAuthed(true)
      else setAuthed(false)
      setLeads(loadLeads())
    }
  }, [open])

  useEffect(() => {
    if (open && authed) setLeads(loadLeads())
  }, [open, authed, tab])

  const handleAuth = (e) => {
    e.preventDefault()
    if (pass === PASSKEY) {
      sessionStorage.setItem(LS_AUTH, '1')
      setAuthed(true)
    } else setError('Incorrect passkey')
  }

  const logout = () => {
    sessionStorage.removeItem(LS_AUTH)
    setAuthed(false)
    setPass('')
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-xl overflow-y-auto"
      >
        <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="glass-strong rounded-3xl w-full max-w-6xl relative overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-30 h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 grid place-items-center">
              <X size={18} />
            </button>

            {!authed ? (
              <div className="p-8 sm:p-12 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center shadow-glow-cyan mb-4">
                    <Shield size={28} className="text-navy-900" />
                  </div>
                  <h2 className="font-display font-extrabold text-2xl mb-2">Admin Access</h2>
                  <p className="text-sm text-white/60">Enter the admin passkey to continue.</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-3">
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow/70" />
                    <input
                      type="password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="Passkey"
                      autoFocus
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-glow/50 transition-colors"
                    />
                  </div>
                  {error && <div className="text-rose-300 text-sm">{error}</div>}
                  <button type="submit" className="btn-glow w-full py-3">Unlock</button>
                  <p className="text-[11px] text-white/40 text-center pt-2">Default passkey: <code className="text-cyan-glow">ium2026</code></p>
                </form>
              </div>
            ) : (
              <DashboardContent
                tab={tab}
                setTab={setTab}
                programmes={programmes}
                setProgrammes={setProgrammes}
                defaultProgrammes={defaultProgrammes}
                leads={leads}
                setLeads={setLeads}
                onLogout={logout}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function DashboardContent({ tab, setTab, programmes, setProgrammes, defaultProgrammes, leads, setLeads, onLogout }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[80vh]">
      {/* Sidebar */}
      <aside className="md:w-60 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-5 flex md:flex-col gap-1 overflow-x-auto">
        <div className="hidden md:block mb-3">
          <div className="font-display font-extrabold text-lg">IUM Admin</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">Intake 2026</div>
        </div>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${active ? 'bg-cyan-glow/10 text-white border border-cyan-glow/30' : 'text-white/65 hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              <Icon size={15} className={active ? 'text-cyan-glow' : ''} />
              {t.label}
            </button>
          )
        })}
        <div className="md:mt-auto md:pt-4">
          <button onClick={onLogout} className="hidden md:inline-flex w-full justify-center px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/20">
            Logout
          </button>
        </div>
      </aside>

      {/* Body */}
      <div className="flex-1 p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
        {tab === 'overview' && <OverviewTab programmes={programmes} leads={leads} />}
        {tab === 'programmes' && <ProgrammesTab programmes={programmes} setProgrammes={setProgrammes} defaultProgrammes={defaultProgrammes} />}
        {tab === 'leads' && <LeadsTab leads={leads} setLeads={setLeads} />}
        {tab === 'faculties' && <FacultiesTab programmes={programmes} />}
        {tab === 'settings' && <SettingsTab onLogout={onLogout} setProgrammes={setProgrammes} defaultProgrammes={defaultProgrammes} />}
      </div>
    </div>
  )
}

function StatCard({ label, value, accent = '#22d3ee', icon: Icon }) {
  return (
    <div className="gradient-border p-5 relative overflow-hidden">
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: accent }} />
      <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-widest text-white/55">
        {Icon && <Icon size={12} style={{ color: accent }} />} {label}
      </div>
      <div className="font-display font-extrabold text-3xl">{value}</div>
    </div>
  )
}

function OverviewTab({ programmes, leads }) {
  const contacted = leads.filter(l => l.status === 'Contacted').length
  const featured = programmes.filter(p => p.featured).length

  const interestCounts = useMemo(() => {
    const map = {}
    leads.forEach(l => {
      if (!l.programmeName) return
      map[l.programmeName] = (map[l.programmeName] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [leads])

  return (
    <div>
      <h2 className="font-display font-extrabold text-2xl mb-1">Overview</h2>
      <p className="text-sm text-white/55 mb-6">Snapshot of programmes and lead activity.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total programmes" value={programmes.length} accent="#22d3ee" icon={GraduationCap} />
        <StatCard label="Total leads" value={leads.length} accent="#2dd4bf" icon={Users} />
        <StatCard label="Contacted leads" value={contacted} accent="#10b981" icon={CheckCircle2} />
        <StatCard label="Featured programmes" value={featured} accent="#f5d27a" icon={Star} />
      </div>

      <div className="gradient-border p-5">
        <h3 className="text-xs uppercase tracking-widest text-white/55 mb-3">Most interested programmes</h3>
        {interestCounts.length === 0 ? (
          <p className="text-sm text-white/55">No leads yet.</p>
        ) : (
          <ul className="space-y-2">
            {interestCounts.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-sm">{name}</span>
                <span className="text-sm font-bold text-cyan-glow">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ProgrammesTab({ programmes, setProgrammes, defaultProgrammes }) {
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const fileRef = useRef(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q ? programmes.filter(p =>
      `${p.programmeName} ${p.faculty} ${p.category}`.toLowerCase().includes(q)
    ) : programmes
  }, [programmes, search])

  const remove = (id) => {
    if (!confirm('Delete this programme? This change is stored locally.')) return
    const next = programmes.filter(p => p.id !== id)
    setProgrammes(next); saveProgrammesOverride(next)
  }

  const saveOne = (p) => {
    const next = p._isNew
      ? [...programmes, { ...p, id: `p-${Date.now()}` }]
      : programmes.map(x => x.id === p.id ? p : x)
    next.forEach(x => delete x._isNew)
    setProgrammes(next); saveProgrammesOverride(next); setEditing(null)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(programmes, null, 2)], { type: 'application/json' })
    download(blob, 'ium-programmes.json')
  }

  const exportCSV = () => {
    const headers = ['programmeName','category','faculty','level','duration','studyMode','campus','intake','intakeStatus','fee']
    const rows = programmes.map(p => headers.map(h => csv(p[h])).join(','))
    const blob = new Blob([headers.join(',') + '\n' + rows.join('\n')], { type: 'text/csv' })
    download(blob, 'ium-programmes.csv')
  }

  const importJSON = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const arr = JSON.parse(text)
      if (Array.isArray(arr)) { setProgrammes(arr); saveProgrammesOverride(arr) }
      else alert('Invalid JSON: expected an array.')
    } catch { alert('Could not parse JSON.') }
    e.target.value = ''
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display font-extrabold text-2xl">Programmes</h2>
          <p className="text-sm text-white/55">Add, edit, delete. Stored in localStorage.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEditing({ _isNew: true, id: '', programmeName: '', category: 'Undergraduate', faculty: FACULTIES[0], level: 'Bachelor', duration: '', studyMode: 'Full-time', campus: 'Male’ Main Campus', intake: 'August 2026', intakeStatus: 'Open', fee: '', seats: 0, description: '', entryRequirements: [], keywords: [], interests: [], careerPaths: [], skills: [], applyLink: '', brochureLink: '', officialPageLink: '', featured: false })} className="btn-glow text-sm py-2 px-3">
            <Plus size={14} /> New
          </button>
          <button onClick={exportJSON} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10"><Download size={13} /> JSON</button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10"><Download size={13} /> CSV</button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10"><Upload size={13} /> Import</button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={importJSON} />
        </div>
      </div>

      <div className="mb-4 relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programmes…"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] uppercase tracking-widest text-cyan-glow/70">{p.category}</span>
                {p.featured && <Star size={11} className="text-gold-400 fill-gold-400" />}
              </div>
              <div className="font-semibold text-sm truncate">{p.programmeName}</div>
              <div className="text-[11px] text-white/50 truncate">{p.faculty} · {p.duration} · {p.studyMode}</div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => setEditing(p)} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-cyan-glow/15 border border-white/10 grid place-items-center text-white/70 hover:text-cyan-glow"><Pencil size={14} /></button>
              <button onClick={() => remove(p.id)} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 grid place-items-center text-white/70 hover:text-rose-300"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <ProgrammeEditor
            programme={editing}
            onClose={() => setEditing(null)}
            onSave={saveOne}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProgrammeEditor({ programme, onClose, onSave }) {
  const [p, setP] = useState({
    ...programme,
    entryRequirements: Array.isArray(programme.entryRequirements) ? programme.entryRequirements.join('\n') : (programme.entryRequirements || ''),
    keywords: Array.isArray(programme.keywords) ? programme.keywords.join(', ') : (programme.keywords || ''),
    interests: Array.isArray(programme.interests) ? programme.interests.join(', ') : (programme.interests || ''),
    careerPaths: Array.isArray(programme.careerPaths) ? programme.careerPaths.join(', ') : (programme.careerPaths || ''),
    skills: Array.isArray(programme.skills) ? programme.skills.join(', ') : (programme.skills || '')
  })

  const u = (k, v) => setP(x => ({ ...x, [k]: v }))

  const save = () => {
    const out = {
      ...p,
      entryRequirements: String(p.entryRequirements || '').split('\n').map(s => s.trim()).filter(Boolean),
      keywords: String(p.keywords || '').split(',').map(s => s.trim()).filter(Boolean),
      interests: String(p.interests || '').split(',').map(s => s.trim()).filter(Boolean),
      careerPaths: String(p.careerPaths || '').split(',').map(s => s.trim()).filter(Boolean),
      skills: String(p.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      seats: Number(p.seats) || 0
    }
    onSave(out)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-6">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="glass-strong rounded-3xl w-full max-w-2xl"
        >
          <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-extrabold text-xl">{p._isNew ? 'New Programme' : 'Edit Programme'}</h3>
                <p className="text-sm text-white/55">All changes are stored locally.</p>
              </div>
              <button onClick={onClose} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 grid place-items-center"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Inp label="Programme name" value={p.programmeName} onChange={(v) => u('programmeName', v)} full />
              <Sel label="Category" value={p.category} onChange={(v) => u('category', v)} options={['Postgraduate','Undergraduate','Certificate & Diploma']} />
              <Sel label="Faculty" value={p.faculty} onChange={(v) => u('faculty', v)} options={FACULTIES} />
              <Sel label="Level" value={p.level} onChange={(v) => u('level', v)} options={['Certificate','Diploma','Bachelor','Master','PhD']} />
              <Inp label="Duration" value={p.duration} onChange={(v) => u('duration', v)} />
              <Sel label="Study Mode" value={p.studyMode} onChange={(v) => u('studyMode', v)} options={['Full-time','Part-time','Online','Hybrid','Flexible']} />
              <Inp label="Campus" value={p.campus} onChange={(v) => u('campus', v)} />
              <Inp label="Intake" value={p.intake} onChange={(v) => u('intake', v)} />
              <Sel label="Intake Status" value={p.intakeStatus} onChange={(v) => u('intakeStatus', v)} options={['Open','Closing Soon','Closed','Coming Soon']} />
              <Inp label="Fee" value={p.fee} onChange={(v) => u('fee', v)} />
              <Inp label="Seats" value={p.seats} onChange={(v) => u('seats', v)} type="number" />
              <div className="sm:col-span-2"><Ta label="Description" value={p.description} onChange={(v) => u('description', v)} rows={3} /></div>
              <div className="sm:col-span-2"><Ta label="Entry requirements (one per line)" value={p.entryRequirements} onChange={(v) => u('entryRequirements', v)} rows={3} /></div>
              <Inp label="Keywords (comma-separated)" value={p.keywords} onChange={(v) => u('keywords', v)} full />
              <Inp label="Interests (comma-separated)" value={p.interests} onChange={(v) => u('interests', v)} full />
              <Inp label="Career paths (comma-separated)" value={p.careerPaths} onChange={(v) => u('careerPaths', v)} full />
              <Inp label="Skills (comma-separated)" value={p.skills} onChange={(v) => u('skills', v)} full />
              <Inp label="Apply link" value={p.applyLink} onChange={(v) => u('applyLink', v)} />
              <Inp label="Brochure link" value={p.brochureLink} onChange={(v) => u('brochureLink', v)} />
              <Inp label="Official page link" value={p.officialPageLink} onChange={(v) => u('officialPageLink', v)} full />
              <label className="sm:col-span-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!p.featured} onChange={(e) => u('featured', e.target.checked)} className="h-4 w-4 accent-cyan-400" />
                Featured programme (★)
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10">Cancel</button>
              <button onClick={save} className="btn-glow text-sm py-2 px-4">Save Programme</button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Inp({ label, value, onChange, type = 'text', full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-[10px] uppercase tracking-widest text-white/45 mb-1">{label}</label>
      <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm focus:border-cyan-glow/50" />
    </div>
  )
}
function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-white/45 mb-1">{label}</label>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm focus:border-cyan-glow/50">
        {options.map(o => <option key={o} value={o} className="bg-navy-700">{o}</option>)}
      </select>
    </div>
  )
}
function Ta({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-white/45 mb-1">{label}</label>
      <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm focus:border-cyan-glow/50 resize-none" />
    </div>
  )
}

function LeadsTab({ leads, setLeads }) {
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')

  const updateStatus = (id, newStatus) => {
    const next = leads.map(l => l.id === id ? { ...l, status: newStatus } : l)
    setLeads(next); saveLeads(next)
  }
  const remove = (id) => {
    if (!confirm('Delete this lead?')) return
    const next = leads.filter(l => l.id !== id)
    setLeads(next); saveLeads(next)
  }
  const exportCSV = () => {
    const headers = ['createdAt','fullName','contact','island','programmeName','programmeCategory','contactMethod','message','status']
    const rows = leads.map(l => headers.map(h => csv(l[h])).join(','))
    const blob = new Blob([headers.join(',') + '\n' + rows.join('\n')], { type: 'text/csv' })
    download(blob, 'ium-leads.csv')
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter(l => {
      if (status !== 'All' && l.status !== status) return false
      if (q && !`${l.fullName} ${l.contact} ${l.programmeName} ${l.island}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [leads, status, search])

  const STATUSES = ['New', 'Contacted', 'Enrolled', 'Closed']

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display font-extrabold text-2xl">Leads</h2>
          <p className="text-sm text-white/55">{leads.length} total · saved on this device.</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10"><Download size={13} /> Export CSV</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, contact, programme…" className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none text-sm" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none text-sm">
          <option className="bg-navy-700">All</option>
          {STATUSES.map(s => <option key={s} className="bg-navy-700">{s}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/55 rounded-2xl border border-white/10 bg-white/5">No leads to show.</div>
        ) : filtered.map(l => (
          <div key={l.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold">{l.fullName} <span className="text-white/40 text-xs">· {l.island}</span></div>
                <div className="text-xs text-white/65">{l.programmeName || 'No programme'} · {l.contactMethod} · {l.contact}</div>
                {l.message && <div className="text-xs text-white/50 mt-1 italic">“{l.message}”</div>}
                <div className="text-[10px] text-white/35 mt-1">{new Date(l.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)} className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                  {STATUSES.map(s => <option key={s} className="bg-navy-700">{s}</option>)}
                </select>
                <button onClick={() => remove(l.id)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-rose-500/15 border border-white/10 grid place-items-center text-white/70 hover:text-rose-300"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FacultiesTab({ programmes }) {
  const facultyCounts = useMemo(() => {
    const map = {}
    programmes.forEach(p => { map[p.faculty] = (map[p.faculty] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [programmes])

  return (
    <div>
      <h2 className="font-display font-extrabold text-2xl mb-1">Faculties</h2>
      <p className="text-sm text-white/55 mb-5">Programme counts per faculty.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {facultyCounts.map(([fac, count]) => (
          <div key={fac} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-sm">{fac}</div>
              <div className="text-[11px] text-white/50">Faculty</div>
            </div>
            <div className="font-display font-extrabold text-2xl text-cyan-glow">{count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ onLogout, setProgrammes, defaultProgrammes }) {
  const reset = () => {
    if (!confirm('Reset all programmes to the original data set? Custom edits will be lost.')) return
    resetProgrammesOverride()
    setProgrammes(defaultProgrammes)
  }
  const wipeLeads = () => {
    if (!confirm('Delete ALL leads stored on this device?')) return
    saveLeads([])
    window.location.reload()
  }
  return (
    <div>
      <h2 className="font-display font-extrabold text-2xl mb-1">Settings</h2>
      <p className="text-sm text-white/55 mb-5">Manage data and access on this device.</p>
      <div className="space-y-3">
        <SettingRow title="Reset programmes" desc="Restore the original programme list and discard local edits.">
          <button onClick={reset} className="px-3 py-2 rounded-xl text-sm bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-400/40 text-white/80 hover:text-rose-200">Reset</button>
        </SettingRow>
        <SettingRow title="Delete all leads" desc="Remove every lead saved on this device. Cannot be undone.">
          <button onClick={wipeLeads} className="px-3 py-2 rounded-xl text-sm bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-400/40 text-white/80 hover:text-rose-200">Delete</button>
        </SettingRow>
        <SettingRow title="End admin session" desc="Lock the admin dashboard until passkey is entered again.">
          <button onClick={onLogout} className="px-3 py-2 rounded-xl text-sm bg-white/5 hover:bg-white/10 border border-white/10">Logout</button>
        </SettingRow>
      </div>
      <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/55">
        <strong className="text-white/80">Note:</strong> All data — programmes, edits, leads — lives in this browser’s localStorage. Export regularly from the Programmes and Leads tabs to share or back up.
      </div>
    </div>
  )
}

function SettingRow({ title, desc, children }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-white/55">{desc}</div>
      </div>
      {children}
    </div>
  )
}

// --- utils ---
function csv(v) {
  if (v == null) return ''
  const s = Array.isArray(v) ? v.join(';') : String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}
function download(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}
