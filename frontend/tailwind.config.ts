import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      /* ========================================
         OPTIMIZED COLOR PALETTE
         ======================================== */
      colors: {
        primary: "#0e7c85",
        "primary-dark": "#1a6b94",
        "primary-light": "#2a9db8",
        accent: "#bcecef",
        "accent-light": "#d7f4f6",
        "accent-lighter": "#eafcfd",
      },

      /* ========================================
         OPTIMIZED SPACING SCALE
         ======================================== */
      spacing: {
        safe: "env(safe-area-inset-left)",
        "safe-top": "env(safe-area-inset-top)",
        "safe-right": "env(safe-area-inset-right)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },

      /* ========================================
         OPTIMIZED TYPOGRAPHY
         ======================================== */
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
      },

      fontSize: {
        // Optimized for readability and performance
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "4.5rem", letterSpacing: "-0.03em" }],
      },

      lineHeight: {
        tight: "1.2",
        normal: "1.5",
        relaxed: "1.75",
        loose: "2",
      },

      /* ========================================
         OPTIMIZED ANIMATIONS
         ======================================== */
      animation: {
        // Smooth, GPU-accelerated animations
        "fade-in": "fadeIn 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards",
        "slide-in-left":
          "slideInLeft 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards",
        "slide-in-right":
          "slideInRight 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards",
        "slide-in-top":
          "slideInTop 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards",
        blob: "blob 7s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInTop: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        blob: {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            animationTimingFunction: "cubic-bezier(0.42, 0, 0.58, 1)",
          },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },

      /* ========================================
         OPTIMIZED TRANSITIONS
         ======================================== */
      transitionDuration: {
        fast: "150ms",
        base: "300ms",
        slow: "500ms",
        slower: "700ms",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        ease: "cubic-bezier(0.33, 1, 0.68, 1)",
        "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
        "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
      },

      /* ========================================
         OPTIMIZED SHADOWS
         ======================================== */
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        base: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(14, 124, 133, 0.3)",
        "glow-lg": "0 0 40px rgba(14, 124, 133, 0.4)",
      },

      /* ========================================
         OPTIMIZED BLUR
         ======================================== */
      blur: {
        xs: "2px",
        sm: "4px",
        base: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },

      /* ========================================
         OPTIMIZED ROUNDED CORNERS
         ======================================== */
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        base: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },

      /* ========================================
         OPTIMIZED Z-INDEX
         ======================================== */
      zIndex: {
        hide: "-1",
        auto: "auto",
        base: "10",
        dropdown: "100",
        sticky: "200",
        fixed: "300",
        modal: "400",
        popover: "500",
        tooltip: "600",
        notification: "700",
      },

      /* ========================================
         OPTIMIZED BACKDROP BLUR
         ======================================== */
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        base: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },

      /* ========================================
         OPTIMIZED GRADIENTS
         ======================================== */
      backgroundImage: {
        "gradient-to-br":
          "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-to-bl":
          "linear-gradient(to bottom left, var(--tw-gradient-stops))",
        "gradient-to-tr":
          "linear-gradient(to top right, var(--tw-gradient-stops))",
        "gradient-to-tl":
          "linear-gradient(to top left, var(--tw-gradient-stops))",
      },

      /* ========================================
         OPTIMIZED CONTAINER QUERIES
         ======================================== */
      containers: {
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
      },

      /* ========================================
         OPTIMIZED ASPECT RATIOS
         ======================================== */
      aspectRatio: {
        square: "1 / 1",
        video: "16 / 9",
        thumbnail: "4 / 3",
        portrait: "3 / 4",
        landscape: "21 / 9",
        ultrawide: "32 / 9",
      },
    },
  },

  plugins: [
    // Custom plugin for additional optimizations
    function ({ addUtilities, matchUtilities, theme }: any) {
      // GPU acceleration utilities
      addUtilities({
        ".gpu-accelerate": {
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        } as any,
        ".will-animate": {
          willChange: "transform, opacity",
        } as any,
        ".will-change-scroll": {
          willChange: "scroll-position",
        } as any,
        ".contain-layout": {
          contain: "layout",
        } as any,
        ".contain-paint": {
          contain: "paint",
        } as any,
        ".contain-strict": {
          contain: "strict",
        } as any,
      });

      // Touch-friendly utilities
      matchUtilities(
        {
          "touch-target": (value: any) => ({
            minHeight: value,
            minWidth: value,
          }),
        },
        {
          values: {
            44: "2.75rem", // 44px - minimum touch target
            48: "3rem", // 48px - comfortable touch target
            56: "3.5rem", // 56px - generous touch target
          },
        }
      );

      // Responsive text scaling
      matchUtilities(
        {
          "text-balance": (value: any) => ({
            textWrap: value,
          }),
        },
        {
          values: {
            balance: "balance",
            pretty: "pretty",
            auto: "auto",
          },
        }
      );

      // Safe area utilities
      matchUtilities(
        {
          "p-safe": (value: any) => ({
            padding: `max(${value}, env(safe-area-inset-left)) max(${value}, env(safe-area-inset-top)) max(${value}, env(safe-area-inset-right)) max(${value}, env(safe-area-inset-bottom))`,
          }),
        },
        {
          values: theme("spacing"),
        }
      );
    },
  ],
};

export default config as Config;
