import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e53e3e",
          hover: "#dc2626",
        },
        text: {
          DEFAULT: "#1f2937",
          muted: "#666666",
          label: "#686b6f",
        },
        gray: {
          bg: "#f9f9f9",
          border: "#d1d5db",
          light: "#f3f4f6",
          500: "#6b7280",
        },
      },
      fontFamily: {
        lato: ["var(--font-lato)", "Lato", "sans-serif"],
        "open-sans": ["var(--font-open-sans)", "Open Sans", "sans-serif"],
      },
      fontSize: {
        "heading-1": [
          "3rem",
          { lineHeight: "1.2", letterSpacing: "-0.5px", fontWeight: "700" },
        ],
        "heading-2": ["25px", { lineHeight: "1", fontWeight: "700" }],
        "heading-3": ["1.25rem", { lineHeight: "1.2", fontWeight: "600" }],
        body: ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        subtitle: ["1.25rem", { lineHeight: "1.5", fontWeight: "400" }],
        base: ["17px", { lineHeight: "1", fontWeight: "400" }],
        soft: ["12px", { lineHeight: "1", fontWeight: "400" }],
      },
      maxWidth: {
        container: "1400px",
      },
      screens: {
        mobile: { max: "850px" },
        tablet: { max: "768px" },
        // md: "768px" (Tailwind default - tablet and up)
        // lg: "1024px" (Tailwind default - desktop)
      },
      boxShadow: {
        header: "0 4px 2px -2px rgba(0, 0, 0, 0.05)",
      },
      spacing: {
        "standard-x": "5%",
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
        "44": "2.75rem", // 44px - WCAG 2.1 Level AAA touch target minimum
        "48": "3rem", // 48px - larger touch target for primary actions
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        "10": "0.625rem", // 10px - commonly used in the app
        "20": "1.25rem", // 20px - used in Accordion component
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s ease-in-out infinite",
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
