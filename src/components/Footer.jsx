import { Sparkles, ExternalLink, Mail, Phone } from 'lucide-react'

export default function Footer({ onAdmin }) {
  return (
    <footer className="relative px-4 sm:px-6 pb-10 pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl px-6 sm:px-10 py-8 sm:py-10 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-cyan-glow/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center shadow-glow-cyan">
                  <span className="font-display font-extrabold text-navy-900">I</span>
                </div>
                <div>
                  <div className="font-display font-bold leading-none">IUM</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/55">Intake Course Guide</div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">A premium digital companion for Islamic University of Maldives August 2026 intake — discover your pathway.</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
                <Sparkles size={12} className="text-emerald-300" />
                <span className="text-xs font-medium text-emerald-300">August 2026 Intake Open</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/45 mb-3">Official</div>
              <ul className="space-y-2 text-sm">
                <li><a className="text-white/75 hover:text-cyan-glow inline-flex items-center gap-1.5" href="https://www.ium.edu.mv/" target="_blank" rel="noreferrer">www.ium.edu.mv <ExternalLink size={12} /></a></li>
                <li><a className="text-white/75 hover:text-cyan-glow inline-flex items-center gap-1.5" href="https://www.ium.edu.mv/coursecategory/post-graduate-programmes" target="_blank" rel="noreferrer">Postgraduate <ExternalLink size={12} /></a></li>
                <li><a className="text-white/75 hover:text-cyan-glow inline-flex items-center gap-1.5" href="https://www.ium.edu.mv/coursecategory/undergraduate-programmes" target="_blank" rel="noreferrer">Undergraduate <ExternalLink size={12} /></a></li>
                <li><a className="text-white/75 hover:text-cyan-glow inline-flex items-center gap-1.5" href="https://www.ium.edu.mv/coursecategory/certificate-and-diploma-programmes" target="_blank" rel="noreferrer">Certificate & Diploma <ExternalLink size={12} /></a></li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/45 mb-3">Get in touch</div>
              <ul className="space-y-2 text-sm">
                <li className="text-white/75 inline-flex items-center gap-2"><Mail size={13} className="text-cyan-glow" /> info@ium.edu.mv</li>
                <li className="text-white/75 inline-flex items-center gap-2"><Phone size={13} className="text-cyan-glow" /> +960 332-1001</li>
              </ul>
              <button onClick={onAdmin} className="mt-5 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-white/55 hover:text-white border border-white/10 hover:border-cyan-glow/30 transition-all">
                Admin Dashboard
              </button>
            </div>
          </div>
          <div className="relative mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/40">
            <div>© {new Date().getFullYear()} Islamic University of Maldives — Intake Course Guide</div>
            <div>Built for digital expo · v1.0</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
