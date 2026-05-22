import { motion } from 'framer-motion'

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="absolute inset-0 geo-pattern opacity-50" />

      {/* Floating blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] h-[40vw] w-[40vw] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(34,211,238,0.35), transparent 70%)' }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] h-[45vw] w-[45vw] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(20,184,166,0.30), transparent 70%)' }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[30%] right-[20%] h-[25vw] w-[25vw] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(245,210,122,0.18), transparent 70%)' }}
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Particle dots */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + (i % 4),
            height: 4 + (i % 4),
            top: `${(i * 53) % 100}%`,
            left: `${(i * 97) % 100}%`,
            background: i % 3 === 0 ? '#f5d27a' : i % 3 === 1 ? '#22d3ee' : '#2dd4bf',
            boxShadow: '0 0 10px currentColor',
            opacity: 0.6
          }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{
            duration: 6 + (i % 5),
            repeat: Infinity,
            delay: (i % 7) * 0.4,
            ease: 'easeInOut'
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-900/40 pointer-events-none" />
    </div>
  )
}
