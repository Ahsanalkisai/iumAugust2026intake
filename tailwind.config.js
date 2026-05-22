/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#040716',
          800: '#070d24',
          700: '#0b1437',
          600: '#10204f',
          500: '#16306c'
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488'
        },
        cyan: {
          glow: '#22d3ee'
        },
        gold: {
          400: '#f5d27a',
          500: '#e6b450',
          600: '#c9933a'
        },
        cream: '#f8f5ee'
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 30% 20%, rgba(34,211,238,0.18), transparent 55%), radial-gradient(circle at 75% 75%, rgba(20,184,166,0.18), transparent 55%), radial-gradient(circle at 50% 100%, rgba(245,210,122,0.10), transparent 60%)',
        'mesh': 'linear-gradient(135deg, #040716 0%, #070d24 40%, #0b1437 100%)'
      },
      boxShadow: {
        'glow-cyan': '0 0 40px rgba(34,211,238,0.35), 0 0 8px rgba(34,211,238,0.6)',
        'glow-teal': '0 0 40px rgba(20,184,166,0.35), 0 0 8px rgba(20,184,166,0.6)',
        'glow-gold': '0 0 30px rgba(230,180,80,0.35), 0 0 6px rgba(230,180,80,0.6)',
        'glass': '0 30px 60px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
      },
      animation: {
        'float-slow': 'float 14s ease-in-out infinite',
        'float-slower': 'float 22s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'gradient-x': 'gradientX 8s ease infinite'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(20px,-30px) scale(1.05)' }
        },
        glowPulse: {
          '0%,100%': { opacity: '0.7', filter: 'blur(20px)' },
          '50%': { opacity: '1', filter: 'blur(28px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    }
  },
  plugins: []
}
