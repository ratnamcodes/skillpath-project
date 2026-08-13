import { addPropertyControls, ControlType } from "framer"
import { useCallback, useEffect, useMemo, useState } from "react"

/** The API fields this component reads. */
interface Course {
    courseName: string
    courseCode: string
    description: string
    mainCategory: string
    shortCourse: string
    courseType: string
    pricePaise: number
    priceUsdCents: number
    refundable: boolean
}

type CountryCode = "IN" | "US"

type CoursesState =
    | { status: "loading" }
    | { status: "error" }
    | { status: "empty" }
    | { status: "ready"; courses: Course[] }

type CurrencyState =
    | { status: "resolving" }
    | { status: "resolved"; country: CountryCode; source: "api" | "fallback" }

interface CourseDataResult {
    courses: CoursesState
    currency: CurrencyState
    retryCourses: () => void
}

const COURSES_ENDPOINT = "https://syncsphere-hiv6.onrender.com/assignment/course-data"
const COUNTRY_ENDPOINT = "https://syncsphere-hiv6.onrender.com/assignment/country-code"
const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 250

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type Outcome = { ok: true; value: unknown } | { ok: false }

async function loadJson(url: string, signal: AbortSignal): Promise<Outcome> {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const response = await fetch(url, { signal })
            if (response.ok) return { ok: true, value: await response.json() }
            console.warn(`[Skillpath] ${url} responded ${response.status}`, await response.text())
        } catch (error) {
            if (signal.aborted) throw error; console.warn(`[Skillpath] ${url} request failed`, error)
        }
        if (attempt < MAX_ATTEMPTS) await delay(RETRY_DELAY_MS)
    }
    return { ok: false }
}

// Validate the values rendered by the card, especially both price fields.
function isCourse(value: unknown): value is Course {
    const c = value as Course
    return (
        typeof c === "object" &&
        c !== null &&
        typeof c.courseCode === "string" &&
        typeof c.courseName === "string" &&
        typeof c.description === "string" &&
        typeof c.courseType === "string" &&
        Number.isFinite(c.pricePaise) &&
        Number.isFinite(c.priceUsdCents)
    )
}

function parseCountry(value: unknown): CountryCode | null {
    const code = (value as { country_code?: unknown } | null)?.country_code
    return code === "IN" || code === "US" ? code : null
}

function useCourseData(fallbackCountry: CountryCode): CourseDataResult {
    const [courses, setCourses] = useState<CoursesState>({ status: "loading" })
    const [currency, setCurrency] = useState<CurrencyState>({ status: "resolving" })
    const [attempt, setAttempt] = useState(0)

    const retryCourses = useCallback(() => setAttempt((n) => n + 1), [])

    useEffect(() => {
        const controller = new AbortController()

        setCourses({ status: "loading" })
        loadJson(COURSES_ENDPOINT, controller.signal)
            .then((outcome) => {
                if (controller.signal.aborted) return
                if (!outcome.ok) {
                    setCourses({ status: "error" })
                    return
                }
                if (!Array.isArray(outcome.value) || !outcome.value.every(isCourse)) {
                    setCourses({ status: "error" })
                    return
                }
                setCourses(
                    outcome.value.length === 0
                        ? { status: "empty" }
                        : { status: "ready", courses: outcome.value }
                )
            })
            .catch(() => {/* aborted on unmount */})

        return () => controller.abort()
    }, [attempt])

    useEffect(() => {
        const controller = new AbortController()

        loadJson(COUNTRY_ENDPOINT, controller.signal)
            .then((outcome) => {
                if (controller.signal.aborted) return
                const detectedCountry = outcome.ok ? parseCountry(outcome.value) : null
                setCurrency({
                    status: "resolved",
                    country: detectedCountry ?? fallbackCountry,
                    source: detectedCountry ? "api" : "fallback",
                })
            })
            .catch(() => {/* aborted on unmount */})

        return () => controller.abort()
    }, [])

    return { courses, currency, retryCourses }
}


const RUPEES = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
})
const DOLLARS = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

function formatPrice(course: Course, country: CountryCode): string {
    return country === "IN"
        ? RUPEES.format(course.pricePaise / 100)
        : DOLLARS.format(course.priceUsdCents / 100)
}

// DESIGN TOKENS — sampled from webveda.com so the section sits in the brand.
const T = {
    ink: "#070815",
    brand: "#4353CF",
    brandDeep: "#252A6C",
    paper: "#FFFFFF",
    surface: "#F3F4F6",
    rule: "#E3E4EA",
    cardHover: "#FAFAFD",
    shimmer: "#E7E9F2",
    muted: "#5A5F72",
    measure: 1210,
    cardMin: 320,
    gap: 24,
} as const

const FONT = `"Radio Canada Big", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@400;500;600;700&display=swap');

.sp-root { font-family: ${FONT}; color: ${T.ink}; background: ${T.paper}; padding: 64px 24px; box-sizing: border-box; }
.sp-root *, .sp-root *::before, .sp-root *::after { box-sizing: border-box; }
.sp-inner { max-width: ${T.measure}px; margin: 0 auto; }

.sp-head { font-size: clamp(32px, 5vw, 56px); font-weight: 600; line-height: 1.1; margin: 0 0 12px; letter-spacing: -0.01em; }
.sp-head-accent { color: ${T.brand}; }
.sp-sub { font-size: clamp(16px, 2vw, 24px); font-weight: 400; color: ${T.muted}; margin: 0 0 32px; line-height: 1.4; }

.sp-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 28px; }
.sp-search { flex: 1 1 240px; min-width: 0; }
.sp-field {
  width: 100%; font: inherit; font-size: 15px; color: ${T.ink};
  padding: 11px 14px; border: 1px solid ${T.rule}; border-radius: 8px;
  background: ${T.paper}; appearance: none;
}
.sp-field::placeholder { color: ${T.muted}; }
select.sp-field {
  flex: 0 0 auto; width: auto; padding-right: 36px; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A5F72' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
}

.sp-currency {
  display: inline-flex; padding: 3px; gap: 2px;
  border: 1px solid ${T.rule}; border-radius: 8px; background: ${T.surface};
}
.sp-currency-btn {
  font: inherit; font-size: 13px; font-weight: 600; color: ${T.muted};
  border: 0; border-radius: 6px; padding: 7px 11px;
  background: transparent; cursor: pointer;
}
.sp-currency-btn[aria-pressed="true"] { color: ${T.paper}; background: ${T.brand}; }

/* min-height: error/empty must not collapse then snap open. */
.sp-region { min-height: 420px; }
.sp-grid {
  display: grid; gap: ${T.gap}px; list-style: none; margin: 0; padding: 0;
  /* auto-fill, not auto-fit: auto-fit collapses empty tracks, so one search
     hit stretches across the full 1210px. */
  grid-template-columns: repeat(auto-fill, minmax(min(${T.cardMin}px, 100%), 1fr));
}

.sp-card {
  display: flex; flex-direction: column; background: ${T.paper};
  border: 1px solid ${T.rule}; border-radius: 12px; overflow: hidden;
  transition: border-color 180ms ease, background-color 180ms ease;
}
/* No lift/cursor: payload has no URL, so a button hover would lie. */
.sp-card:hover { border-color: ${T.brand}; background: ${T.cardHover}; }

.sp-card-body { padding: 20px 20px 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.sp-pill {
  align-self: flex-start; font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: ${T.brand}; border: 1px solid ${T.brand};
  border-radius: 999px; padding: 4px 10px; line-height: 1;
  transition: background-color 180ms ease, color 180ms ease;
}
.sp-card:hover .sp-pill { background: ${T.brand}; color: ${T.paper}; }
.sp-title { font-size: 20px; font-weight: 600; line-height: 1.25; margin: 0; letter-spacing: -0.005em; }
.sp-desc {
  font-size: 14px; line-height: 1.5; color: ${T.muted}; margin: 0;
  min-height: 42px; display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.sp-bar {
  margin-top: auto; background: ${T.brandDeep}; color: ${T.paper};
  padding: 14px 20px; display: flex; align-items: baseline;
  justify-content: space-between; gap: 12px;
}
/* No tabular-nums: this face gives the decimal a full figure width ("$39 . 99"). */
.sp-price { font-size: 24px; font-weight: 600; letter-spacing: -0.01em; }
.sp-refund { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; opacity: 0.92; white-space: nowrap; }

.sp-skel, .sp-skel-bar {
  background: linear-gradient(90deg, ${T.surface} 0%, ${T.shimmer} 50%, ${T.surface} 100%);
  background-size: 200% 100%;
  animation: sp-shimmer 1.3s ease-in-out infinite;
}
.sp-skel { border-radius: 6px; }
.sp-skel-bar { margin-top: auto; height: 60px; border-top: 1px solid ${T.rule}; }
/* Light-on-dark stand-in while country is still resolving. */
.sp-price-skel {
  width: 96px; height: 28px; border-radius: 4px; flex-shrink: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.12) 100%);
  background-size: 200% 100%;
  animation: sp-shimmer 1.3s ease-in-out infinite;
}
@keyframes sp-shimmer {
  from { background-position: 150% 0; }
  to   { background-position: -50% 0; }
}

.sp-msg {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; gap: 12px; min-height: 420px; padding: 40px 24px;
  border: 1px solid ${T.rule}; border-radius: 12px; background: ${T.surface};
}
.sp-msg-title { font-size: 22px; font-weight: 600; margin: 0; }
.sp-msg-body { font-size: 15px; color: ${T.muted}; margin: 0; max-width: 46ch; line-height: 1.5; }
.sp-btn {
  font: inherit; font-size: 15px; font-weight: 600; color: ${T.paper};
  background: ${T.brand}; border: 0; border-radius: 8px; padding: 11px 22px;
  cursor: pointer; margin-top: 4px;
  transition: background-color 160ms ease, transform 110ms ease;
}
.sp-btn:hover { background: ${T.brandDeep}; }
.sp-btn:active { transform: translateY(1px); }

/* No border-radius here: every focusable control declares its own, and the outline follows it. */
.sp-root :focus-visible { outline: 2px solid ${T.brand}; outline-offset: 2px; }
/* Keyframes end at the natural state, so reducing motion leaves a composed page. */
@media (prefers-reduced-motion: reduce) {
  .sp-root *, .sp-root *::before, .sp-root *::after {
    animation: none !important; transition: none !important;
  }
}
`

// -------------------------------- PIECES --------------------------------

function CheckMark() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path d="M2.5 6.3l2.4 2.4 4.6-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function CourseCard({ course, price }: { course: Course; price: string | null }) {
    return (
        <li className="sp-card">
            <div className="sp-card-body">
                <span className="sp-pill">{course.courseType}</span>
                <h3 className="sp-title">{course.courseName}</h3>
                <p className="sp-desc">{course.description}</p>
            </div>
            <div className="sp-bar">
                {price ? (
                    <span className="sp-price">{price}</span>
                ) : (
                    <span className="sp-price-skel" aria-hidden="true" />
                )}
                {course.refundable && (
                    <span className="sp-refund">
                        <CheckMark />
                        Refundable
                    </span>
                )}
            </div>
        </li>
    )
}

function SkeletonGrid() {
    return (
        <ul className="sp-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
                <li className="sp-card" key={i}>
                    <div className="sp-card-body">
                        <div className="sp-skel" style={{ width: 84, height: 22, borderRadius: 999 }} />
                        <div className="sp-skel" style={{ width: "72%", height: 25 }} />
                        <div className="sp-skel" style={{ width: "100%", height: 16 }} />
                        <div className="sp-skel" style={{ width: "88%", height: 16 }} />
                    </div>
                    <div className="sp-skel-bar" />
                </li>
            ))}
        </ul>
    )
}

function MessagePanel({ title, body, action }: { title: string; body: string; action?: { label: string; onClick: () => void } }) {
    return (
        <div className="sp-msg" role="status" aria-live="polite">
            <h3 className="sp-msg-title">{title}</h3>
            <p className="sp-msg-body">{body}</p>
            {action && (
                <button type="button" className="sp-btn" onClick={action.onClick}>
                    {action.label}
                </button>
            )}
        </div>
    )
}

// -------------------------------- COMPONENT --------------------------------

type SortKey = "recommended" | "priceAsc" | "priceDesc"
type PreviewState = "auto" | "loading" | "empty" | "error"

function applyPreview(preview: PreviewState, live: CoursesState): CoursesState {
    switch (preview) {
        case "loading":
            return { status: "loading" }
        case "empty":
            return { status: "empty" }
        case "error":
            return { status: "error" }
        default:
            return live
    }
}

interface CourseGridProps {
    heading: string
    subheading: string
    fallbackCurrency: CountryCode
    preview: PreviewState
}

/**
 * @framerIntrinsicWidth 1210
 * @framerIntrinsicHeight 780
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function CourseGrid(props: Partial<CourseGridProps>) {
    const {
        heading = "Expert Courses",
        subheading = "In-depth courses launched every week — from the best instructors in the country.",
        fallbackCurrency = "IN",
        preview = "auto",
    } = props

    const data = useCourseData(fallbackCurrency)
    const courses = applyPreview(preview, data.courses)

    const [query, setQuery] = useState("")
    const [sort, setSort] = useState<SortKey>("recommended")
    const [chosenCountry, setChosenCountry] = useState<CountryCode | null>(null)

    const country: CountryCode | null =
        chosenCountry ?? (data.currency.status === "resolved" ? data.currency.country : null)
    const switchCountry = country ?? "IN"
    const showCurrencySwitch =
        data.currency.status === "resolved" && data.currency.source === "fallback"

    const all = courses.status === "ready" ? courses.courses : []

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase()
        const matched = q
            ? all.filter((c) =>
                  `${c.courseName} ${c.description} ${c.mainCategory} ${c.shortCourse}`.toLowerCase().includes(q)
              )
            : all
        if (sort === "recommended" || country === null) return matched
        const key = (c: Course) => (country === "IN" ? c.pricePaise : c.priceUsdCents)
        return [...matched].sort((a, b) => (sort === "priceAsc" ? key(a) - key(b) : key(b) - key(a)))
    }, [all, query, sort, country])

    const [firstWord, ...restWords] = heading.split(" ")
    const currencyBusy = courses.status === "ready" && country === null

    return (
        <div className="sp-root" id="courses">
            <style>{STYLES}</style>
            <div className="sp-inner">
                <h2 className="sp-head">
                    <span className="sp-head-accent">{firstWord}</span>
                    {restWords.length > 0 && ` ${restWords.join(" ")}`}
                </h2>
                <p className="sp-sub">{subheading}</p>

                {courses.status === "ready" && (
                    <div className="sp-toolbar">
                        <div className="sp-search">
                            <input
                                type="search"
                                className="sp-field"
                                placeholder="Search courses"
                                aria-label="Search courses"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="sp-field"
                            aria-label="Sort courses"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                        >
                            <option value="recommended">Recommended</option>
                            <option value="priceAsc">Price: low to high</option>
                            <option value="priceDesc">Price: high to low</option>
                        </select>
                        {showCurrencySwitch && (
                            <div className="sp-currency" role="group" aria-label="Display currency">
                                {(["IN", "US"] as const).map((code) => (
                                    <button
                                        type="button"
                                        className="sp-currency-btn"
                                        aria-pressed={switchCountry === code}
                                        onClick={() => setChosenCountry(code)}
                                        key={code}
                                    >
                                        {code === "IN" ? "INR" : "USD"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div
                    className="sp-region"
                    aria-busy={courses.status === "loading" || currencyBusy}
                >
                    {courses.status === "loading" && <SkeletonGrid />}

                    {courses.status === "error" && (
                        <MessagePanel
                            title="Uh-oh, something went wrong"
                            body="We couldn't load the courses right now. Please try again."
                            action={{ label: "Try again", onClick: data.retryCourses }}
                        />
                    )}

                    {courses.status === "empty" && (
                        <MessagePanel
                            title="No courses yet"
                            body="New courses go live every week. Check back shortly, or reload to see if any have landed."
                            action={{ label: "Reload courses", onClick: data.retryCourses }}
                        />
                    )}

                    {courses.status === "ready" &&
                        (visible.length === 0 ? (
                            <MessagePanel
                                title={`No courses match “${query.trim()}”`}
                                body="Try a shorter search, or clear it to see every course."
                                action={{ label: "Clear search", onClick: () => setQuery("") }}
                            />
                        ) : (
                            <ul className="sp-grid">
                                {visible.map((course) => (
                                    <CourseCard
                                        key={course.courseCode}
                                        course={course}
                                        price={country ? formatPrice(course, country) : null}
                                    />
                                ))}
                            </ul>
                        ))}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(CourseGrid, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Expert Courses",
        description: "The first word is shown in the brand indigo.",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "In-depth courses launched every week — from the best instructors in the country.",
        displayTextArea: true,
    },
    fallbackCurrency: {
        type: ControlType.Enum,
        title: "Fallback",
        defaultValue: "IN",
        options: ["IN", "US"],
        optionTitles: ["Rupees (₹)", "US dollars ($)"],
        description: "Currency to show when we cannot detect the visitor's region.",
    },
    preview: {
        type: ControlType.Enum,
        title: "Preview",
        defaultValue: "auto",
        options: ["auto", "loading", "empty", "error"],
        optionTitles: ["Live data", "Loading", "No courses", "Failed"],
        description: "Force a state to design against. Leave on Live data when publishing.",
    },
})
