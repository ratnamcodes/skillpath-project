import { addPropertyControls, ControlType } from "framer"

const T = {
    surface: "#F3F4F6",
    rule: "#E3E4EA",
    muted: "#5A5F72",
    ink: "#070815",
    brand: "#4353CF",
    measure: 1210,
} as const

const FONT = `"Radio Canada Big", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@400;500&display=swap');

.sp-ft { font-family: ${FONT}; background: ${T.surface}; border-top: 1px solid ${T.rule};
         container-type: inline-size; box-sizing: border-box; }
.sp-ft *, .sp-ft *::before, .sp-ft *::after { box-sizing: border-box; }
.sp-ft-inner {
  max-width: ${T.measure}px; margin: 0 auto; padding: 32px 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.sp-ft-links { display: flex; gap: 24px; }
.sp-ft-link { font-size: 14px; font-weight: 500; color: ${T.muted}; text-decoration: none; }
.sp-ft-link:hover { color: ${T.ink}; }
.sp-ft-copy { font-size: 14px; font-weight: 400; color: ${T.muted}; margin: 0; }
.sp-ft :focus-visible { outline: 2px solid ${T.brand}; outline-offset: 3px; border-radius: 4px; }

@container (max-width: 809px) {
  .sp-ft-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
}
`

interface FooterProps {
    linkOne: string
    linkTwo: string
    linkThree: string
    copyright: string
}

/**
 * @framerIntrinsicWidth 1210
 * @framerIntrinsicHeight 96
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Footer(props: Partial<FooterProps>) {
    const {
        linkOne = "About",
        linkTwo = "Contact",
        linkThree = "Privacy",
        copyright = "© 2026 Skillpath",
    } = props

    return (
        <footer className="sp-ft">
            <style>{STYLES}</style>
            <div className="sp-ft-inner">
                <nav className="sp-ft-links" aria-label="Footer">
                    {[linkOne, linkTwo, linkThree].map((label) => (
                        <a className="sp-ft-link" href="#courses" key={label}>
                            {label}
                        </a>
                    ))}
                </nav>
                <p className="sp-ft-copy">{copyright}</p>
            </div>
        </footer>
    )
}

addPropertyControls(Footer, {
    linkOne: { type: ControlType.String, title: "Link 1", defaultValue: "About" },
    linkTwo: { type: ControlType.String, title: "Link 2", defaultValue: "Contact" },
    linkThree: { type: ControlType.String, title: "Link 3", defaultValue: "Privacy" },
    copyright: { type: ControlType.String, title: "Copyright", defaultValue: "© 2026 Skillpath" },
})
