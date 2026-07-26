import Interview from './Interview'
import FieldList from './components/FieldList'
import SectionHead from './components/SectionHead'
import {
  CONTACT_CTA,
  CONTACT_HREF,
  INTERVIEW_CTA,
  INTERVIEW_HREF,
  NAV_LINKS,
} from './site'

const DUTIES = [
  'Answer every inbound inquiry (web form, email, referral) in under sixty seconds, at any hour.',
  'Qualify by the kind of work, timeline, and fit, in whatever language your clients use.',
  'Turn away the inquiries that are not a fit, politely and on the record.',
  'Book qualified meetings straight into your calendar.',
  'File every conversation where the firm already keeps its records.',
  'Report each Monday: what came in, what was booked, what is stuck.',
]

const STATS = [
  { value: '< 60 sec', label: 'Median time to first response' },
  { value: '24 / 7', label: 'Hours it works, including weekends' },
  { value: '90 days', label: 'Wrong-hire guarantee' },
]

const SAMPLE_OFFER = [
  { label: 'Employer', value: 'Halden Recruiting Group' },
  { label: 'Handles', value: 'Candidate and client inquiries' },
  { label: 'Coverage', value: 'US and Canada' },
  { label: 'Start date', value: 'Next Monday' },
]

const ROLE_FACTS = [
  { label: 'Reports to', value: 'The founder' },
  { label: 'Managed by', value: 'A named human at Tenure' },
  { label: 'Hours', value: 'All of them' },
  { label: 'Judged on', value: 'Speed to lead, meetings booked' },
]

const SEQUENCE = [
  {
    title: 'The role is written down',
    copy: 'A scorecard, the same as any hire: the outcomes it owns, the numbers it is judged on, and the lines it does not cross.',
  },
  {
    title: 'You interview the candidate',
    copy: 'Before anything is signed, you put it through your own intake and watch how it handles the inquiries you actually get.',
  },
  {
    title: 'An offer is signed',
    copy: 'Responsibilities, compensation, start date, and the ninety-day guarantee, on paper and countersigned by Tenure.',
  },
  {
    title: 'It starts on a Monday',
    copy: 'Accounts provisioned, introduced to your team by title, and a week in shadow mode reading real inquiries before it answers one.',
  },
  {
    title: 'It reports every week',
    copy: 'A written standup each Monday: what it did, what is next, where it is stuck, and the numbers behind all three.',
  },
  {
    title: 'It is reviewed every quarter',
    copy: 'Performance against the scorecard, with its manager present, and a proposal for what it should learn next.',
  },
]

const TERMS = [
  {
    term: 'A hiring fee, then a salary',
    gloss:
      'Priced against what the work is worth, not per seat and not per message. It comes out of payroll, where the comparison actually makes sense.',
  },
  {
    term: 'Ninety-day guarantee',
    gloss:
      'If the role is not performing against its scorecard in the first ninety days, we rebuild it or replace it. The same guarantee recruiters give.',
  },
]

const QUESTIONS = [
  {
    q: 'Isn’t this just ChatGPT with extra steps?',
    a: 'ChatGPT is a tool you operate. This is a role someone else runs. It holds responsibilities, has a manager, reports on Mondays, and is reviewed each quarter. You never open a prompt window.',
  },
  {
    q: 'What happens when it gets something wrong?',
    a: 'The same thing that happens when any employee does: its manager owns it. You get an incident report, the fix, and the retraining that followed. Accountability is the product. The software is just how it is delivered.',
  },
  {
    q: 'Will it pretend to be a person?',
    a: 'Never. It introduces itself as AI, signs as AI, and says so plainly when asked. Your clients’ trust is worth more than a parlor trick, and disclosure is the law in a growing number of states.',
  },
  {
    q: 'Why not just hire someone?',
    a: 'For judgment-heavy work, you should. For high-volume structured intake, this hire answers in seconds at three in the morning, remembers every inquiry it has ever taken, and does not resign in eight months.',
  },
]

export default function Page() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav__row">
          <a className="nav__brand" href="/">
            <span className="nav__mark">Tenure</span>
            <span className="nav__badge">AI Employment Firm</span>
          </a>
          <div className="nav__links">
            {NAV_LINKS.map((link) => (
              <a className="nav__link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="nav__cta">
            <a className="btn btn--sm" href={INTERVIEW_HREF}>
              {INTERVIEW_CTA}
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="wrap hero">
          <div className="hero__copy">
            <p className="eyebrow rise rise--1">AI Employment Firm</p>
            <h1 className="hero__title rise rise--1">Meet your next hire.</h1>
            <p className="hero__standfirst rise rise--2">
              Tenure designs, hires, trains, and manages AI employees built around whatever role
              your business actually needs. Below is an example we&rsquo;ve already built, an
              Intake Coordinator: it answers every inquiry in under a minute, never claims to be a
              person, and has a named human here accountable for its work.
            </p>
            <div className="hero__actions rise rise--3">
              <a className="btn" href={INTERVIEW_HREF}>
                {INTERVIEW_CTA}
              </a>
              <a className="btn btn--quiet" href="#pricing">
                See pricing
              </a>
            </div>
            <div className="hero__proof rise rise--3">
              <span className="hero__proof-item">Openly artificial</span>
              <span className="hero__proof-item">Managed by a named human</span>
              <span className="hero__proof-item">90-day guarantee</span>
            </div>
          </div>

          <div className="preview rise rise--2">
            <div className="preview__head">
              <span className="preview__head-label">Sample offer of employment</span>
              <span className="pill">Example</span>
            </div>
            <FieldList block="preview" className="preview__body" fields={SAMPLE_OFFER} />
            <p className="preview__foot">
              Generated live during an actual interview.{' '}
              <a href={INTERVIEW_HREF}>Try yours below.</a>
            </p>
          </div>
        </section>

        <section className="wrap section">
          <div className="stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="stat__value">{stat.value}</p>
                <p className="stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section section--tint" aria-labelledby="role-heading">
          <div className="feature">
            <SectionHead
              className={null}
              id="role-heading"
              eyebrow="Not a fixed catalog"
              title="Every role starts as a scorecard, built for what you need."
              lede="There is no set first hire. Every AI employee starts as a scorecard scoped to your business, the same document a firm would write for a person. Below is one we have already built, as an example."
            >
              <ul className="checklist">
                {DUTIES.map((duty) => (
                  <li className="checklist__item" key={duty}>
                    {duty}
                  </li>
                ))}
              </ul>
            </SectionHead>

            <div className="role-card">
              <div className="role-card__head">
                <p className="role-card__kicker">Role scorecard</p>
                <span className="pill">Example</span>
              </div>
              <h3 className="role-card__title">Intake Coordinator (AI)</h3>
              <FieldList block="role-card" className="role-card__grid" fields={ROLE_FACTS} />
              <p className="role-card__boundary">
                <strong>Boundary.</strong> It qualifies, schedules, and collects facts. It does
                not give professional advice, quote pricing, or promise outcomes. Those go to
                someone on the team, every time.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap section" id="interview" aria-labelledby="interview-heading">
          <SectionHead
            id="interview-heading"
            eyebrow="Try the example"
            title="Interview it yourself, the way you would interview anyone."
            lede="This is our Intake Coordinator, built as an example. Tell it about your firm and watch it work; the role Tenure builds for you would be scoped to what your business actually needs. As you talk, the offer of employment beside the transcript fills itself in."
          />
          <Interview />
        </section>

        <section className="wrap section section--tint" id="how-it-works" aria-labelledby="sequence-heading">
          <SectionHead
            id="sequence-heading"
            eyebrow="How employment works"
            title="Six steps, in order, every time."
          />
          <ol className="timeline">
            {SEQUENCE.map((step, index) => (
              <li className="timeline__item" key={step.title}>
                <span className="timeline__index">{index + 1}</span>
                <h3 className="timeline__title">{step.title}</h3>
                <p className="timeline__copy">{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap section" id="pricing" aria-labelledby="terms-heading">
          <SectionHead
            id="terms-heading"
            eyebrow="Terms"
            title="Priced like a hire, guaranteed like one."
          />
          <div className="pricing">
            {TERMS.map(({ term, gloss }) => (
              <div className="price-card" key={term}>
                <p className="price-card__term">{term}</p>
                <p className="price-card__gloss">{gloss}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section section--tint" id="faq" aria-labelledby="questions-heading">
          <SectionHead
            id="questions-heading"
            eyebrow="Questions"
            title="The four every owner asks."
          />
          <div className="faq">
            {QUESTIONS.map(({ q, a }) => (
              <details className="faq__item" key={q}>
                <summary>
                  {q}
                  <span className="faq__chevron" aria-hidden="true">
                    &#9660;
                  </span>
                </summary>
                <p className="faq__answer">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <div className="wrap">
            <h2 className="cta-band__title">Hiring is the part you already know how to do.</h2>
            <p className="cta-band__lede">
              Businesses don&rsquo;t buy AI. They hire capability. If the inquiries reaching your
              firm are going cold before anyone answers them, that is a staffing problem, and we
              solve staffing problems.
            </p>
            <div className="cta-band__actions">
              <a className="btn btn--on-ink" href={CONTACT_HREF}>
                {CONTACT_CTA}
              </a>
              <a className="btn btn--ghost-on-ink" href={INTERVIEW_HREF}>
                {INTERVIEW_CTA}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <div className="footer__grid">
          <div>
            <p className="footer__mark">Tenure</p>
            <p className="footer__blurb">
              An AI employment firm for founder-led service businesses. Every AI employee
              discloses that it is AI, in every channel.
            </p>
          </div>
          <div>
            <p className="footer__heading">Site</p>
            <div className="footer__links">
              {NAV_LINKS.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
              <a href={INTERVIEW_HREF}>{INTERVIEW_CTA}</a>
            </div>
          </div>
          <div>
            <p className="footer__heading">Contact</p>
            <div className="footer__links">
              <a href={CONTACT_HREF}>{CONTACT_CTA}</a>
            </div>
          </div>
        </div>
        <div className="footer__base">
          <p>Tenure, AI Employment Firm</p>
          <p>&copy; 2026 Tenure</p>
        </div>
      </footer>
    </>
  )
}
