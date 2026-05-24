import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0D6EFD',
          light: '#3D8BFF',
          dark: '#0A58CA',
        },
        accent: {
          DEFAULT: '#7C3AED',
          light: '#8B5CF6',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
        },
        surface: {
          DEFAULT: '#111111',
          alt: '#0A0A0A',
          dark: '#000000',
        },
        'border-dark': '#2A2A2A',
        border: '#D1D5DB',
        text: {
          DEFAULT: '#FFFFFF',
          muted: '#9CA3AF',
          secondary: '#D1D5DB',
        },
      },
      boxShadow: {
        card: '0 20px 80px rgba(17, 24, 39, 0.08)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0D6EFD 0%, #7C3AED 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
