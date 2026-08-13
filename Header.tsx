import { addPropertyControls, ControlType } from "framer"

/** Skillpath — header. Wordmark, three nav links, one join button. */

const T = {
    ink: "#070815",
    brand: "#4353CF",
    brandDeep: "#252A6C",
    paper: "#FFFFFF",
    rule: "#E3E4EA",
    muted: "#5A5F72",
    measure: 1210,
} as const

const FONT = `"Radio Canada Big", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@400;500;600&display=swap');
.sp-hd { font-family: ${FONT}; background: ${T.paper}; border-bottom: 1px solid ${T.rule};
         container-type: inline-size; box-sizing: border-box; }
.sp-hd *, .sp-hd *::before, .sp-hd *::after { box-sizing: border-box; }
.sp-hd-inner {
  max-width: ${T.measure}px; margin: 0 auto; height: 72px; padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
}
.sp-hd-mark { font-size: 20px; font-weight: 600; color: ${T.ink}; text-decoration: none; }
.sp-hd-nav { display: flex; align-items: center; gap: 28px; }
.sp-hd-link { font-size: 15px; font-weight: 500; color: ${T.muted}; text-decoration: none; white-space: nowrap; }
.sp-hd-link:hover { color: ${T.ink}; }
.sp-hd-join {
  font: inherit; font-size: 15px; font-weight: 600; color: ${T.paper};
  background: ${T.brand}; border: 0; border-radius: 8px; padding: 10px 24px;
  text-decoration: none; white-space: nowrap; display: inline-block;
}
.sp-hd-join:hover { background: ${T.brandDeep}; }
.sp-hd :focus-visible { outline: 2px solid ${T.brand}; outline-offset: 3px; border-radius: 4px; }
@container (max-width: 809px) {
  .sp-hd-nav { display: none; }
}
`

interface HeaderProps {
    wordmark: string
    linkOne: string
    linkTwo: string
    linkThree: string
    ctaLabel: string
}

export default function Header(props: Partial<HeaderProps>) {
    const {
        wordmark = "Skillpath",
        linkOne = "Courses",
        linkTwo = "Community",
        linkThree = "Teach",
        ctaLabel = "Join",
    } = props

    return (
        <header className="sp-hd">
            <style>{STYLES}</style>
            <div className="sp-hd-inner">
                <a className="sp-hd-mark" href="#courses">
                    {wordmark}
                </a>
                <nav className="sp-hd-nav" aria-label="Main">
                    {[linkOne, linkTwo, linkThree].map((label) => (
                        <a className="sp-hd-link" href="#courses" key={label}>
                            {label}
                        </a>
                    ))}
                </nav>
                <a className="sp-hd-join" href="#courses">
                    {ctaLabel}
                </a>
            </div>
        </header>
    )
}

addPropertyControls(Header, {
    wordmark: { type: ControlType.String, title: "Wordmark", defaultValue: "Skillpath" },
    linkOne: { type: ControlType.String, title: "Link 1", defaultValue: "Courses" },
    linkTwo: { type: ControlType.String, title: "Link 2", defaultValue: "Community" },
    linkThree: { type: ControlType.String, title: "Link 3", defaultValue: "Teach" },
    ctaLabel: { type: ControlType.String, title: "Button", defaultValue: "Join" },
})
