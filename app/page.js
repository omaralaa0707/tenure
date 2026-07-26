import Interview from './Interview'

const KIT = [
  {
    title: 'Its own workstation',
    copy: 'A dedicated machine of its own, always on, doing the work you assign it.',
  },
  {
    title: 'Its own email',
    copy: 'Sends and receives as itself, inside the systems your team already uses.',
  },
  {
    title: 'Access to your tools',
    copy: 'The same software and platforms any hire on your team would log into.',
  },
]

const PROCESS = [
  {
    title: 'You tell us what needs doing',
    copy: 'The tasks piling up, and where you want an employee, not another subscription.',
  },
  {
    title: 'We design and build it',
    copy: 'Not a generic bot. An AI employee built for those exact tasks, with the access it needs.',
  },
  {
    title: 'It goes to work',
    copy: 'Its own workstation, its own email, live from day one. A named person at Tenure is accountable for how it performs.',
  },
  {
    title: 'You see the results',
    copy: 'A written report every week: what it did, what is still open.',
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
      'If the role is not performing well in the first ninety days, we rebuild it or replace it. The same guarantee recruiters give.',
  },
]

const QUESTIONS = [
  {
    q: 'Do I have to set anything up?',
    a: 'No. You tell us what needs doing, and Tenure designs and builds the employee. You are not configuring software or writing prompts. That is the job we do.',
  },
  {
    q: 'Isn’t this just ChatGPT with extra steps?',
    a: 'ChatGPT is a tool you operate yourself. This is an employee with its own workstation, its own email, and a manager who is accountable for it. You never open a prompt window.',
  },
  {
    q: 'Can it handle senior-level work, or just repetitive tasks?',
    a: 'Both. It is fastest and most independent on repetitive, high-volume work. For senior-level tasks, judgment calls, complex drafting, we recommend a human on your team reviews its output before it goes out. Where that line sits is up to you.',
  },
  {
    q: 'What happens when it gets something wrong?',
    a: 'The same thing that happens when any employee does: its manager owns it. You get told what went wrong, what was fixed, and what changed after. Accountability is the product. The software is just how it is delivered.',
  },
  {
    q: 'Why not just hire someone?',
    a: 'For work that needs real judgment, you should. For the repetitive, always-on work most teams are understaffed for, this hire works nights and weekends, never resigns, and costs less than a junior salary.',
  },
]

const NAV_LINKS = [
  { href: '#delivery', label: 'How it is delivered' },
  { href: '#evidence', label: 'See it work' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export default function Page() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav__row">
          <a className="nav__brand" href="/">
            Tenure
          </a>
          <div className="nav__links">
            {NAV_LINKS.map((link) => (
              <a className="nav__link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <a
            className="btn btn--sm"
            href="mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20interested"
          >
            Talk to Omar
          </a>
        </div>
      </nav>

      <main>
        <section className="wrap hero">
          <h1 className="hero__title rise rise--1">A real employee. It just never sleeps.</h1>
          <p className="hero__standfirst rise rise--2">
            Tenure designs, builds, and manages AI employees for your business. Each one gets its
            own workstation, a company email, and the same access to your tools as anyone on your
            team, minus the weekends, the sick days, and the slow mornings.
          </p>
          <div className="hero__actions rise rise--3">
            <a
              className="btn"
              href="mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20interested"
            >
              Talk to Omar
            </a>
            <a className="btn btn--quiet" href="#evidence">
              See it work
            </a>
          </div>
          <p className="hero__fine rise rise--3">
            A named person at Tenure is accountable for it. Always.
          </p>
        </section>

        <section className="wrap section" aria-labelledby="kit-heading">
          <div className="section__head">
            <p className="eyebrow">What it comes with</p>
            <h2 className="section__title" id="kit-heading">
              The same setup as anyone else on your team.
            </h2>
            <p className="section__lede">
              Not a script bolted onto your inbox. A hire, with the equipment and access that
              implies.
            </p>
          </div>
          <div className="kit">
            {KIT.map((item) => (
              <div className="kit__item" key={item.title}>
                <h3 className="kit__title">{item.title}</h3>
                <p className="kit__copy">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section section--tint" aria-labelledby="capability-heading">
          <div className="section__head">
            <p className="eyebrow">What it is good at</p>
            <h2 className="section__title" id="capability-heading">
              Always on. Fast at the repetitive work. Capable of more.
            </h2>
          </div>
          <div className="capability">
            <div className="capability__col">
              <p className="capability__label">Junior work, done faster</p>
              <p className="capability__copy">
                Repetitive, high-volume tasks: data entry, scheduling, follow-ups, first-pass
                research and drafts. It works around the clock, takes no weekends, and moves
                through this kind of work faster than any junior hire.
              </p>
            </div>
            <div className="capability__col">
              <p className="capability__label">Senior work, with oversight</p>
              <p className="capability__copy">
                It can take on more judgment-heavy work too: analysis, complex drafting, decision
                support. For that tier, we recommend a human on your team reviews its output
                before it goes out. You decide where that line sits.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap section section--tint" id="delivery" aria-labelledby="delivery-heading">
          <div className="section__head">
            <p className="eyebrow">How it is delivered</p>
            <h2 className="section__title" id="delivery-heading">
              You do not operate anything. We deliver the result.
            </h2>
            <p className="section__lede">
              This is a managed hire, not software you configure. Four steps, and Tenure runs all
              of them.
            </p>
          </div>
          <ol className="process">
            {PROCESS.map((step, index) => (
              <li className="process__item" key={step.title}>
                <span className="process__index">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="process__title">{step.title}</h3>
                <p className="process__copy">{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap section" id="evidence" aria-labelledby="evidence-heading">
          <div className="section__head">
            <p className="eyebrow">See it work</p>
            <h2 className="section__title" id="evidence-heading">
              Watch it handle a real inquiry.
            </h2>
            <p className="section__lede">
              This is the Intake Coordinator, one AI employee Tenure has already built: exactly
              the kind of fast, repetitive, junior work described above. Talk to it the way a
              prospective client would, and watch it qualify, respond, and hand off.
            </p>
          </div>
          <div className="evidence">
            <Interview />
          </div>
        </section>

        <section className="wrap section section--tint" id="pricing" aria-labelledby="terms-heading">
          <div className="section__head">
            <p className="eyebrow">Guarantee and pricing</p>
            <h2 className="section__title" id="terms-heading">
              Priced like a hire, guaranteed like one.
            </h2>
          </div>
          <div className="terms">
            {TERMS.map(({ term, gloss }) => (
              <div key={term}>
                <p className="terms__term">{term}</p>
                <p className="terms__gloss">{gloss}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" id="faq" aria-labelledby="questions-heading">
          <div className="section__head">
            <p className="eyebrow">Questions</p>
            <h2 className="section__title" id="questions-heading">
              Questions every owner asks.
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

        <section className="close-band">
          <div className="wrap">
            <h2 className="close-band__title">
              The result is the point. The AI is just how we get there.
            </h2>
            <p className="close-band__lede">
              You already know how to manage people. This is the same thing: a real hire, with
              its own setup, that happens to run on AI. Tell us what needs doing, and we will
              build the employee for it.
            </p>
            <div className="close-band__actions">
              <a
                className="btn btn--on-ink"
                href="mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20interested"
              >
                Talk to Omar
              </a>
              <a className="btn btn--ghost-on-ink" href="#evidence">
                See it work
              </a>
            </div>
            <p className="close-band__fine">
              One founder, not a support queue. That email goes straight to Omar.
            </p>
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <div className="footer__grid">
          <div>
            <p className="footer__mark">Tenure</p>
            <p className="footer__blurb">
              An AI employment firm for founder-led service businesses. We deliver the outcome;
              the AI is just how.
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
            </div>
          </div>
          <div>
            <p className="footer__heading">Contact</p>
            <div className="footer__links">
              <a href="mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20interested">
                Talk to Omar
              </a>
            </div>
          </div>
        </div>
        <div className="footer__base">
          <p>Tenure, AI employment firm</p>
          <p>&copy; 2026 Tenure</p>
        </div>
      </footer>
    </>
  )
}
