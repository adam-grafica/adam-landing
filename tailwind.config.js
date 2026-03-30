/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        // AdamGráfica Colors
        'ag-bg': {
          primary: '#0A0A0A',
          secondary: '#111111',
          tertiary: '#0D0D0D',
          footer: '#050505',
        },
        'ag-blue': {
          DEFAULT: '#0066FF',
          light: '#00AAFF',
          glow: 'rgba(0, 102, 255, 0.4)',
        },
        'ag-green': {
          DEFAULT: '#00FF88',
          glow: 'rgba(0, 255, 136, 0.3)',
        },
        'ag-text': {
          white: '#FFFFFF',
          gray: '#A0A0A0',
          muted: '#666666',
        },
        // shadcn defaults
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontSize: {
        'display-1': ['clamp(2.5rem, 8vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2rem, 5vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-3': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.2' }],
        'display-4': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.25' }],
        'display-5': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.3' }],
        'display-6': ['clamp(1rem, 1.5vw, 1.25rem)', { lineHeight: '1.4' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 102, 255, 0.3)" },
          "50%": { boxShadow: "0 0 50px rgba(0, 102, 255, 0.6)" },
        },
        "grid-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(150%)" },
          "100%": { transform: "translateX(150%)" },
        },
        "scan": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "eyebrow-shine": {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
        },
        "badge-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 rgba(0, 255, 136, 0)" },
          "50%": { boxShadow: "0 0 10px rgba(0, 255, 136, 0.3)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "grid-pulse": "grid-pulse 4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "marquee": "marquee 30s linear infinite",
        "eyebrow-shine": "eyebrow-shine 3s ease-in-out infinite",
        "badge-pulse": "badge-pulse 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(0, 102, 255, 0.4)',
        'glow-blue-lg': '0 0 60px rgba(0, 102, 255, 0.5)',
        'glow-green': '0 0 30px rgba(0, 255, 136, 0.3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
