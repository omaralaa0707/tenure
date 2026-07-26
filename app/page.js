import Interview from './Interview'

const DUTIES = [
  'Answer every inbound inquiry (web form, email, referral) in under sixty seconds, at any hour.',
  'Qualify by case type, jurisdiction, and urgency, in English or Spanish.',
  'Turn away the inquiries that are not a fit, politely and on the record.',
  'Book qualified consultations straight into the attorney calendar.',
  'File every conversation where the firm already keeps its records.',
  'Report each Monday: what came in, what was booked, what is stuck.',
]

const STATS = [
  { value: '< 60 sec', label: 'Median time to first response' },
  { value: '24 / 7', label: 'Hours it works, including weekends' },
  { value: '90 days', label: 'Wrong-hire guarantee' },
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
  {
    term: 'Three founding clients',
    gloss:
      'Tenure is a new firm and says so. The first three firms get a founding rate, fixed, in exchange for letting us publish what the numbers did.',
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

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
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
            <a className="btn btn--sm" href="#interview">
              Interview the candidate
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
              Tenure designs, hires, trains, and manages AI employees for US immigration law
              firms. The first one is an Intake Coordinator: it answers every inquiry in under a
              minute, never claims to be a person, and has a named human here accountable for its
              work.
            </p>
            <div className="hero__actions rise rise--3">
              <a className="btn" href="#interview">
                Interview the candidate
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
            <div className="preview__body">
              <div className="preview__row">
                <span className="preview__key">Employer</span>
                <span className="preview__value">Cardenas &amp; Ruiz LLP</span>
              </div>
              <div className="preview__row">
                <span className="preview__key">Practice</span>
                <span className="preview__value">Family-based immigration</span>
              </div>
              <div className="preview__row">
                <span className="preview__key">Jurisdictions</span>
                <span className="preview__value">Texas</span>
              </div>
              <div className="preview__row">
                <span className="preview__key">Start date</span>
                <span className="preview__value">Next Monday</span>
              </div>
            </div>
            <p className="preview__foot">
              Generated live during an actual interview.{' '}
              <a href="#interview">Try yours below.</a>
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
            <div>
              <p className="eyebrow">The role</p>
              <h2 className="section__title" id="role-heading">
                One role, written down before anyone signs anything.
              </h2>
              <p className="section__lede">
                Every AI employee starts as a scorecard, the same document a firm would write for
                a person. This is the one your firm would be hiring against.
              </p>
              <ul className="checklist">
                {DUTIES.map((duty) => (
                  <li className="checklist__item" key={duty}>
                    {duty}
                  </li>
                ))}
              </ul>
            </div>

            <div className="role-card">
              <p className="role-card__kicker">Role scorecard</p>
              <h3 className="role-card__title">Intake Coordinator (AI)</h3>
              <div className="role-card__grid">
                <div>
                  <span className="role-card__label">Reports to</span>
                  <span className="role-card__value">Managing Attorney</span>
                </div>
                <div>
                  <span className="role-card__label">Managed by</span>
                  <span className="role-card__value">A named human at Tenure</span>
                </div>
                <div>
                  <span className="role-card__label">Hours</span>
                  <span className="role-card__value">All of them</span>
                </div>
                <div>
                  <span className="role-card__label">Judged on</span>
                  <span className="role-card__value">Speed to lead, consults booked</span>
                </div>
              </div>
              <p className="role-card__boundary">
                <strong>Boundary.</strong> It qualifies, schedules, and collects facts. It does
                not give legal advice, assess eligibility, or estimate outcomes. Those go to an
                attorney, every time.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap section" id="interview" aria-labelledby="interview-heading">
          <div className="section__head">
            <p className="eyebrow">Try it</p>
            <h2 className="section__title" id="interview-heading">
              Interview it yourself, the way you would interview anyone.
            </h2>
            <p className="section__lede">
              Tell it about your firm and it will show you how it would run your intake. As you
              talk, the offer of employment beside the transcript fills itself in.
            </p>
          </div>
          <Interview />
        </section>

        <section className="wrap section section--tint" id="how-it-works" aria-labelledby="sequence-heading">
          <div className="section__head">
            <p className="eyebrow">How employment works</p>
            <h2 className="section__title" id="sequence-heading">
              Six steps, in order, every time.
            </h2>
          </div>
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
          <div className="section__head">
            <p className="eyebrow">Terms</p>
            <h2 className="section__title" id="terms-heading">
              Priced like a hire, guaranteed like one.
            </h2>
          </div>
          <div className="pricing">
            {TERMS.map(({ term, gloss }) => (
              <div className="price-card" key={term}>
                <p className="price-card__term">{term}</p>
                <p className="price-card__gloss">{gloss}</p>
              </div>
            ))}
          </div>
          <p className="u-measure u-muted u-sm" style={{ marginTop: 'var(--space-lg)' }}>
            We publish no numbers we have not earned. Ask on the call and you will get the real
            ones, including the ones that are not flattering yet.
          </p>
        </section>

        <section className="wrap section section--tint" id="faq" aria-labelledby="questions-heading">
          <div className="section__head">
            <p className="eyebrow">Questions</p>
            <h2 className="section__title" id="questions-heading">
              The four every attorney asks.
            </h2>
          </div>
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
              <a
                className="btn btn--on-ink"
                href="mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20founding%20client"
              >
                Talk to Omar
              </a>
              <a className="btn btn--ghost-on-ink" href="#interview">
                Interview the candidate
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
              An AI employment firm for US immigration law firms. Every AI employee discloses
              that it is AI, in every channel.
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
              <a href="#interview">Interview the candidate</a>
            </div>
          </div>
          <div>
            <p className="footer__heading">Contact</p>
            <div className="footer__links">
              <a href="mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20founding%20client">
                Talk to Omar
              </a>
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
