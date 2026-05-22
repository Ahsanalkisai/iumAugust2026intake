import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Send, User, Phone, MapPin, Layers, MessageSquare } from 'lucide-react'

const STORAGE_KEY = 'ium_intake_leads'

export function saveLead(lead) {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    arr.push({ ...lead, id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), status: 'New' })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
    return true
  } catch {
    return false
  }
}

export function loadLeads() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
export function saveLeads(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

const CONTACT_METHODS = ['Viber', 'WhatsApp', 'Phone Call', 'SMS', 'Email']

export default function InterestForm({ open, onClose, programme, programmes }) {
  const [form, setForm] = useState({
    fullName: '',
    contact: '',
    island: '',
    programmeId: '',
    contactMethod: 'Viber',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(f => ({
        ...f,
        programmeId: programme?.id || ''
      }))
      setErrors({})
      setSuccess(false)
    }
  }, [open, programme])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.contact.trim()) e.contact = 'Required'
    else if (form.contact.replace(/\D/g, '').length < 6) e.contact = 'Enter a valid number'
    if (!form.island.trim()) e.island = 'Required'
    if (!form.programmeId) e.programmeId = 'Select a programme'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const prog = programmes.find(p => p.id === form.programmeId)
    saveLead({
      ...form,
      programmeName: prog?.programmeName || '',
      programmeCategory: prog?.category || ''
    })
    setSuccess(true)
    setTimeout(() => { onClose?.() }, 2400)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-navy-900/70 backdrop-blur-xl overflow-y-auto"
        >
          <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-6">
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="glass-strong rounded-3xl w-full max-w-lg relative overflow-hidden"
            >
              <button onClick={onClose} className="absolute top-4 right-4 z-10 h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 grid place-items-center transition-colors">
                <X size={18} />
              </button>

              {!success ? (
                <>
                  <div className="px-6 sm:px-8 pt-8 pb-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-cyan-glow/80 mb-2 flex items-center gap-1.5">
                      <Send size={12} /> Express Interest
                    </div>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Tell us about you</h2>
                    <p className="text-sm text-white/60 mt-1">Our team will reach out via your preferred channel.</p>
                  </div>

                  <form onSubmit={submit} className="px-6 sm:px-8 pb-6 space-y-3">
                    <Field icon={User} label="Full name" error={errors.fullName}>
                      <input
                        value={form.fullName}
                        onChange={(e) => update('fullName', e.target.value)}
                        placeholder="Your full name"
                        className="input-base"
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field icon={Phone} label="Contact / Viber" error={errors.contact}>
                        <input
                          value={form.contact}
                          onChange={(e) => update('contact', e.target.value)}
                          placeholder="e.g. 7XX XXXX"
                          className="input-base"
                          inputMode="tel"
                        />
                      </Field>
                      <Field icon={MapPin} label="Island" error={errors.island}>
                        <input
                          value={form.island}
                          onChange={(e) => update('island', e.target.value)}
                          placeholder="e.g. Malé / Hulhumalé"
                          className="input-base"
                        />
                      </Field>
                    </div>

                    <Field icon={Layers} label="Programme interested in" error={errors.programmeId}>
                      <select
                        value={form.programmeId}
                        onChange={(e) => update('programmeId', e.target.value)}
                        className="input-base appearance-none"
                      >
                        <option value="" className="bg-navy-700">Select a programme…</option>
                        {programmes.map(p => (
                          <option key={p.id} value={p.id} className="bg-navy-700">
                            {p.programmeName} ({p.category})
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 ml-1">Preferred contact method</label>
                      <div className="flex flex-wrap gap-2">
                        {CONTACT_METHODS.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => update('contactMethod', m)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.contactMethod === m ? 'border-cyan-glow/60 bg-cyan-glow/15 text-white' : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Field icon={MessageSquare} label="Message (optional)">
                      <textarea
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        placeholder="Any questions or notes…"
                        rows={3}
                        className="input-base resize-none"
                      />
                    </Field>

                    <button type="submit" className="btn-glow w-full mt-3 py-3">
                      Submit Interest <Send size={15} />
                    </button>
                    <p className="text-[11px] text-white/40 text-center">Stored locally on this device. Export from Admin to share with the team.</p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 grid place-items-center shadow-glow-cyan mb-5 relative"
                  >
                    <CheckCircle2 className="text-navy-900" size={36} />
                    <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
                  </motion.div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-2">Thank you!</h2>
                  <p className="text-white/70">Your interest has been recorded.<br />Our team will be in touch soon.</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          <style>{`
            .input-base {
              width: 100%;
              padding: 0.75rem 0.9rem 0.75rem 2.5rem;
              border-radius: 0.875rem;
              background: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.1);
              color: white;
              outline: none;
              font-size: 0.875rem;
              transition: border-color 0.2s;
            }
            .input-base::placeholder { color: rgba(255,255,255,0.35); }
            .input-base:focus { border-color: rgba(34,211,238,0.5); }
            select.input-base { padding-right: 1.5rem; }
            textarea.input-base { padding-top: 0.7rem; padding-bottom: 0.7rem; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ icon: Icon, label, error, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1 ml-1">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow/70" />}
        {children}
      </div>
      {error && <div className="text-xs text-rose-300 mt-1 ml-1">{error}</div>}
    </div>
  )
}
