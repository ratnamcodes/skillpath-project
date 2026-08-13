import { addPropertyControls, ControlType } from "framer"

/**
 * Skillpath — hero. Headline, one line, one button.
 * Decorative bits are CSS only: two glows, a dot grid, and an underline stroke.
 */

const T = {
    ink: "#070815",
    brand: "#4353CF",
    brandLift: "#6675E0",
    paper: "#FFFFFF",
    subline: "rgba(255, 255, 255, 0.72)",
} as const

const FONT = `"Radio Canada Big", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@400;500;600&display=swap');
.sp-hero {
  font-family: ${FONT}; background: ${T.ink}; color: ${T.paper};
  container-type: inline-size; box-sizing: border-box;
  position: relative; overflow: hidden; isolation: isolate;
}
.sp-hero *, .sp-hero *::before, .sp-hero *::after { box-sizing: border-box; }
.sp-hero::before {
  content: ""; position: absolute; inset: 0; z-index: -2;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.09) 1px, transparent 0);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 45%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 45%, #000 40%, transparent 100%);
}
.sp-hero-glow {
  position: absolute; z-index: -1; border-radius: 50%; pointer-events: none;
  filter: blur(70px); opacity: 0.5;
}
.sp-hero-glow-a {
  width: 460px; height: 460px; top: -160px; left: -80px;
  background: ${T.brand};
  animation: sp-drift-a 26s ease-in-out infinite alternate;
}
.sp-hero-glow-b {
  width: 380px; height: 380px; bottom: -180px; right: -60px;
  background: #7C5CE0;
  animation: sp-drift-b 32s ease-in-out infinite alternate;
}
@keyframes sp-drift-a {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(90px, 60px, 0) scale(1.15); }
}
@keyframes sp-drift-b {
  from { transform: translate3d(0, 0, 0) scale(1.1); }
  to   { transform: translate3d(-80px, -50px, 0) scale(1); }
}
.sp-hero-inner {
  max-width: 760px; margin: 0 auto; padding: 96px 24px; text-align: center;
  position: relative;
}
.sp-hero-title {
  font-size: clamp(36px, 5.3cqw, 64px); font-weight: 600; line-height: 1.1;
  letter-spacing: -0.02em; margin: 0 0 20px;
}
.sp-hero-accent { color: ${T.brandLift}; position: relative; white-space: nowrap; }
.sp-hero-underline {
  position: absolute; left: 0; right: 0; bottom: -0.12em; width: 100%; height: 0.16em;
  overflow: visible;
}
.sp-hero-underline path {
  fill: none; stroke: ${T.brand}; stroke-width: 7; stroke-linecap: round;
  stroke-dasharray: 210; stroke-dashoffset: 0;
  animation: sp-draw 900ms cubic-bezier(0.65, 0, 0.35, 1) 620ms backwards;
}
@keyframes sp-draw { from { stroke-dashoffset: 210; } }
.sp-hero-title, .sp-hero-sub, .sp-hero-cta {
  animation: sp-hero-in 640ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
.sp-hero-title { animation-delay: 60ms; }
.sp-hero-sub   { animation-delay: 180ms; }
.sp-hero-cta   { animation-delay: 300ms; }
@keyframes sp-hero-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
.sp-hero-sub {
  font-size: clamp(16px, calc(0.5cqw + 14px), 20px); font-weight: 400; line-height: 1.45;
  color: ${T.subline}; margin: 0 auto 36px; max-width: 560px;
}
.sp-hero-cta {
  display: inline-flex; align-items: center; gap: 10px; font: inherit;
  font-size: 16px; font-weight: 600; color: ${T.paper}; background: ${T.brand};
  border: 0; border-radius: 8px; padding: 14px 28px; cursor: pointer;
  text-decoration: none;
  transition: background-color 180ms ease, transform 120ms ease;
}
.sp-hero-cta:hover { background: ${T.brandLift}; }
.sp-hero-cta:active { transform: translateY(1px); }
.sp-hero-arrow { transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1); }
.sp-hero-cta:hover .sp-hero-arrow { transform: translateX(4px); }
.sp-hero :focus-visible { outline: 2px solid ${T.brandLift}; outline-offset: 3px; border-radius: 4px; }
@container (max-width: 809px) { .sp-hero-inner { padding: 56px 24px; } }
@media (prefers-reduced-motion: reduce) {
  .sp-hero *, .sp-hero *::before, .sp-hero *::after {
    animation: none !important; transition: none !important;
  }
}
`

interface HeroProps {
    title: string
    accentWord: string
    subtitle: string
    ctaLabel: string
}

export default function Hero(props: Partial<HeroProps>) {
    const {
        title = "Skills that compound",
        accentWord = "compound",
        subtitle = "Short, practical courses from people who actually did the thing.",
        ctaLabel = "Browse courses",
    } = props

    const index = accentWord ? title.toLowerCase().indexOf(accentWord.toLowerCase()) : -1
    const before = index >= 0 ? title.slice(0, index) : title
    const match = index >= 0 ? title.slice(index, index + accentWord.length) : ""
    const after = index >= 0 ? title.slice(index + accentWord.length) : ""

    return (
        <section className="sp-hero">
            <style>{STYLES}</style>
            <div className="sp-hero-glow sp-hero-glow-a" aria-hidden="true" />
            <div className="sp-hero-glow sp-hero-glow-b" aria-hidden="true" />

            <div className="sp-hero-inner">
                <h1 className="sp-hero-title">
                    {before}
                    {match && (
                        <span className="sp-hero-accent">
                            {match}
                            <svg
                                className="sp-hero-underline"
                                viewBox="0 0 200 10"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path d="M3 7 C 46 1, 92 9, 134 4 S 186 2, 197 6" />
                            </svg>
                        </span>
                    )}
                    {after}
                </h1>
                <p className="sp-hero-sub">{subtitle}</p>
                <a className="sp-hero-cta" href="#courses">
                    {ctaLabel}
                    <svg
                        className="sp-hero-arrow"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            d="M3 8h9M8.5 4l4 4-4 4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </a>
            </div>
        </section>
    )
}

addPropertyControls(Hero, {
    title: {
        type: ControlType.String,
        title: "Headline",
        defaultValue: "Skills that compound",
        displayTextArea: true,
    },
    accentWord: {
        type: ControlType.String,
        title: "Accent",
        defaultValue: "compound",
        description: "Word within the headline shown in indigo and underlined. Ignored if it is not in the headline.",
    },
    subtitle: {
        type: ControlType.String,
        title: "Subhead",
        defaultValue: "Short, practical courses from people who actually did the thing.",
        displayTextArea: true,
    },
    ctaLabel: { type: ControlType.String, title: "Button", defaultValue: "Browse courses" },
})
