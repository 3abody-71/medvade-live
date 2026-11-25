/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        info: {
          surface: "hsl(var(--info-surface))",
          border: "hsl(var(--info-border))",
          foreground: "hsl(var(--info-foreground))",
        },
        warning: {
          surface: "hsl(var(--warning-surface))",
          border: "hsl(var(--warning-border))",
          foreground: "hsl(var(--warning-foreground))",
          accent: "hsl(var(--warning-accent))",
        },
        success: {
          surface: "hsl(var(--success-surface))",
          border: "hsl(var(--success-border))",
          foreground: "hsl(var(--success-foreground))",
        },
        error: {
          surface: "hsl(var(--error-surface))",
          border: "hsl(var(--error-border))",
          foreground: "hsl(var(--error-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--app-font-sans)"],
        serif: ["var(--app-font-serif)"],
        mono: ["var(--app-font-mono)"],
      },
    },
  },
  plugins: [],
};
