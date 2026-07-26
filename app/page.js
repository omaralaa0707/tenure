import Interview from './Interview'
import SectionHead from './components/SectionHead'
import { CONTACT_CTA, CONTACT_HREF, EVIDENCE_CTA, EVIDENCE_HREF, NAV_LINKS } from './site'

const PROCESS = [
  {
    title: 'You tell us what is slipping',
    copy: 'Where inquiries are being missed, and what you need the role to actually do.',
  },
  {
    title: 'We design and build it',
    copy: 'Not a generic bot. An AI employee built for that exact job, at your firm.',
  },
  {
    title: 'It goes live',
    copy: 'It starts answering real inquiries. A named person at Tenure is accountable for how it performs.',
  },
  {
    title: 'You see the results',
    copy: 'A written report every week: what came in, what got answered, what is still open.',
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
    a: 'No. You tell us what is slipping, and Tenure designs and builds the role. You are not configuring software or writing prompts. That is the job we do.',
  },
  {
    q: 'Isn’t this just ChatGPT with extra steps?',
    a: 'ChatGPT is a tool you operate. This is a role someone else runs. It holds responsibilities, has a manager, and reports weekly. You never open a prompt window.',
  },
  {
    q: 'What happens when it gets something wrong?',
    a: 'The same thing that happens when any employee does: its manager owns it. You get told what went wrong, what was fixed, and what changed after. Accountability is the product. The software is just how it is delivered.',
  },
  {
    q: 'Why not just hire someone?',
    a: 'For judgment-heavy work, you should. For high-volume, repetitive intake, this hire answers in seconds at three in the morning, remembers every inquiry it has ever taken, and does not resign in eight months.',
  },
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
          <a className="btn btn--sm" href={CONTACT_HREF}>
            {CONTACT_CTA}
          </a>
        </div>
      </nav>

      <main>
        <section className="wrap hero">
          <h1 className="hero__title rise rise--1">Never lose another inquiry.</h1>
          <p className="hero__standfirst rise rise--2">
            Tenure designs, builds, and manages the AI employee that answers every inquiry your
            firm gets, day or night, so nothing goes cold while you are busy running the
            business. You do not operate anything. We deliver the result.
          </p>
          <div className="hero__actions rise rise--3">
            <a className="btn" href={CONTACT_HREF}>
              {CONTACT_CTA}
            </a>
            <a className="btn btn--quiet" href={EVIDENCE_HREF}>
              {EVIDENCE_CTA}
            </a>
          </div>
          <p className="hero__fine rise rise--3">
            A named person at Tenure is accountable for it. Always.
          </p>
        </section>

        <section className="wrap section">
          <p className="problem">
            A lead comes in at 11pm on a Friday. <strong>Nobody sees it until Monday.</strong> By
            then, they have already called someone else.
          </p>
        </section>

        <section className="wrap section section--tint" id="delivery" aria-labelledby="delivery-heading">
          <SectionHead
            id="delivery-heading"
            eyebrow="How it is delivered"
            title="You do not operate anything. We deliver the result."
            lede="This is a managed service, not software you configure. Four steps, and Tenure runs all of them."
          />
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
          <SectionHead
            id="evidence-heading"
            eyebrow="See it work"
            title="Watch it handle a real inquiry."
            lede="This is the Intake Coordinator, one role Tenure has already built. Talk to it the way a prospective client would, and watch it qualify, respond, and hand off."
          />
          <div className="evidence">
            <Interview />
          </div>
        </section>

        <section className="wrap section section--tint" id="pricing" aria-labelledby="terms-heading">
          <SectionHead
            id="terms-heading"
            eyebrow="Guarantee and pricing"
            title="Priced like a hire, guaranteed like one."
          />
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
          <SectionHead
            id="questions-heading"
            eyebrow="Questions"
            title="Questions every owner asks."
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

        <section className="close-band">
          <div className="wrap">
            <h2 className="close-band__title">
              The result is the point. The AI is just how we get there.
            </h2>
            <p className="close-band__lede">
              If inquiries are going cold before anyone answers them, that is lost revenue, not a
              technology problem you have to solve yourself. Tell us what is slipping, and we
              will build the fix.
            </p>
            <div className="close-band__actions">
              <a className="btn btn--on-ink" href={CONTACT_HREF}>
                {CONTACT_CTA}
              </a>
              <a className="btn btn--ghost-on-ink" href={EVIDENCE_HREF}>
                {EVIDENCE_CTA}
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
              <a href={CONTACT_HREF}>{CONTACT_CTA}</a>
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
