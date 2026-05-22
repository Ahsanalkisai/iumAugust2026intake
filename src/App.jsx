import { useEffect, useRef, useState } from 'react'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategorySection from './components/CategorySection'
import BrowseProgrammes from './components/BrowseProgrammes'
import ProgrammeModal from './components/ProgrammeModal'
import Quiz from './components/Quiz'
import CourseAssistant from './components/CourseAssistant'
import InterestForm from './components/InterestForm'
import AdminDashboard, { loadProgrammesOverride } from './components/AdminDashboard'
import Footer from './components/Footer'
import { PROGRAMMES as DEFAULT_PROGRAMMES } from './data/programmes'
import { MessageSquare, Compass } from 'lucide-react'
import { motion } from 'framer-motion'

export default function App() {
  const [programmes, setProgrammes] = useState(() => loadProgrammesOverride(DEFAULT_PROGRAMMES))
  const [active, setActive] = useState('home')
  const [query, setQuery] = useState('')
  const [browseFilters, setBrowseFilters] = useState(null)
  const [modalProgramme, setModalProgramme] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [interestOpen, setInterestOpen] = useState(false)
  const [interestProgramme, setInterestProgramme] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)

  const sectionRefs = {
    home: useRef(null),
    categories: useRef(null),
    browse: useRef(null)
  }

  const navigate = (id) => {
    setActive(id)
    if (id === 'quiz') return setQuizOpen(true)
    if (id === 'assistant') return setAssistantOpen(true)
    const target = sectionRefs[id]?.current
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      const positions = Object.entries(sectionRefs).map(([id, ref]) => {
        const el = ref.current
        return { id, top: el?.getBoundingClientRect().top ?? Infinity }
      })
      const inView = positions.filter(p => p.top < window.innerHeight * 0.4).sort((a, b) => b.top - a.top)[0]
      if (inView && inView.id !== active) setActive(inView.id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [active])

  const handleSearch = (q) => {
    setQuery(q)
    setBrowseFilters(null)
    sectionRefs.browse.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSelectCategory = (cat) => {
    setBrowseFilters({ category: cat })
    setQuery('')
    sectionRefs.browse.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleInterest = (p) => {
    setInterestProgramme(p || null)
    setInterestOpen(true)
  }

  return (
    <div className="min-h-screen relative">
      <Background />
      <Navbar active={active} onNavigate={navigate} onAdmin={() => setAdminOpen(true)} />

      <main>
        <div ref={sectionRefs.home}>
          <Hero onNavigate={navigate} onSearch={handleSearch} />
        </div>
        <div ref={sectionRefs.categories}>
          <CategorySection programmes={programmes} onSelectCategory={handleSelectCategory} />
        </div>
        <div ref={sectionRefs.browse}>
          <BrowseProgrammes
            programmes={programmes}
            query={query}
            setQuery={setQuery}
            initialFilters={browseFilters}
            onView={setModalProgramme}
            onInterest={handleInterest}
          />
        </div>
      </main>

      <Footer onAdmin={() => setAdminOpen(true)} />

      {/* Floating action buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30 flex flex-col gap-2.5 sm:gap-3" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring' }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
          onClick={() => setQuizOpen(true)}
          className="group relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-cyan-glow to-teal-500 grid place-items-center shadow-glow-cyan"
          title="Find My Course"
          aria-label="Find My Course"
        >
          <Compass className="text-navy-900" size={20} />
          <span className="absolute inset-0 rounded-2xl border border-cyan-glow/50 animate-ping opacity-60" />
        </motion.button>
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.7, type: 'spring' }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
          onClick={() => setAssistantOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 grid place-items-center shadow-glow-gold"
          title="Ask Assistant"
          aria-label="Ask Assistant"
        >
          <MessageSquare className="text-navy-900" size={20} />
        </motion.button>
      </div>

      <Quiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        programmes={programmes}
        onViewProgramme={(p) => { setQuizOpen(false); setModalProgramme(p) }}
        onInterest={(p) => { setQuizOpen(false); handleInterest(p) }}
      />

      <ProgrammeModal
        programme={modalProgramme}
        allProgrammes={programmes}
        onClose={() => setModalProgramme(null)}
        onInterest={(p) => { setModalProgramme(null); handleInterest(p) }}
      />

      <CourseAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        programmes={programmes}
        onViewProgramme={(p) => { setAssistantOpen(false); setModalProgramme(p) }}
      />

      <InterestForm
        open={interestOpen}
        onClose={() => { setInterestOpen(false); setInterestProgramme(null) }}
        programme={interestProgramme}
        programmes={programmes}
      />

      <AdminDashboard
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        programmes={programmes}
        setProgrammes={setProgrammes}
        defaultProgrammes={DEFAULT_PROGRAMMES}
      />
    </div>
  )
}
