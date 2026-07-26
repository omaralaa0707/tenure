import Interview from './Interview'

const DUTIES = [
  'Answer every inbound inquiry (web form, email, referral) in under sixty seconds, at any hour.',
  'Qualify by case type, jurisdiction, and urgency, in English or Spanish.',
  'Turn away the inquiries that are not a fit, politely and on the record.',
  'Book qualified consultations straight into the attorney calendar.',
  'File every conversation where the firm already keeps its records.',
  'Report each Monday: what came in, what was booked, what is stuck.',
]

const SEQUENCE = [
  {
    title: 'The role is written down',
    copy: 'A scorecard, the same as any hire: the outcomes it owns, the numbers it is judged on, and the lines it does not cross.',
  },
  {
    title: 'You interview the candidate',
    copy: 'Before anything is signed, you put it through your own intake and watch how it handles the inquiries you actually get. That is the panel above.',
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

export default function Page() {
  return (
    <div className="shell">
      <header className="masthead">
        <a className="masthead__mark" href="/">
          Tenure
          <span className="masthead__descriptor">AI Employment Firm</span>
        </a>
        <a className="masthead__link" href="#interview">
          Interview the candidate
        </a>
      </header>

      <main>
        <section className="hero">
          <h1 className="hero__title rise rise--1">Meet your next hire.</h1>
          <p className="hero__standfirst rise rise--2">
            Tenure designs, hires, trains, and manages AI employees for US immigration law firms.
            The first one is an Intake Coordinator. It answers every inquiry in under a minute, it
            never claims to be a person, and a named human here is accountable for its work.
          </p>
          <div className="hero__actions rise rise--3">
            <a className="btn" href="#interview">
              Interview the candidate
            </a>
            <a className="btn btn--quiet" href="#terms">
              What it costs
            </a>
          </div>
        </section>

        <section className="band" aria-labelledby="candidate-heading">
          <p className="band__label">The candidate</p>
          <div className="band__body">
            <h2 className="band__title" id="candidate-heading">
              One role, written down before anyone signs anything.
            </h2>
            <p className="u-measure u-muted">
              Every AI employee starts as a scorecard, the same document a firm would write for a
              person. This is the one your firm would be hiring against.
            </p>

            <article className="doc">
              <p className="doc__kicker">Role scorecard</p>
              <h3 className="doc__title">Intake Coordinator (AI)</h3>

              <dl className="doc__fields">
                <div>
                  <dt className="field__key">Reports to</dt>
                  <dd className="field__value">Managing Attorney</dd>
                </div>
                <div>
                  <dt className="field__key">Managed by</dt>
                  <dd className="field__value">A named human at Tenure</dd>
                </div>
                <div>
                  <dt className="field__key">Hours</dt>
                  <dd className="field__value">All of them</dd>
                </div>
                <div>
                  <dt className="field__key">Judged on</dt>
                  <dd className="field__value">Speed to lead, consultations booked</dd>
                </div>
              </dl>

              <ul className="duties">
                {DUTIES.map((duty) => (
                  <li className="duties__item" key={duty}>
                    {duty}
                  </li>
                ))}
              </ul>

              <p className="doc__boundary">
                <strong>Boundary.</strong> It qualifies, schedules, and collects facts. It does not
                give legal advice, assess eligibility, or estimate outcomes. Those go to an
                attorney, every time. The line is written into the role, not left to judgment.
              </p>
            </article>
          </div>
        </section>

        <section className="band" id="interview" aria-labelledby="interview-heading">
          <p className="band__label">The interview</p>
          <div className="band__body">
            <h2 className="band__title" id="interview-heading">
              Interview it now, the way you would interview anyone.
            </h2>
            <p className="u-measure u-muted">
              Tell it about your firm and it will show you how it would run your intake. As you
              talk, the offer of employment beside the transcript fills itself in.
            </p>
            <Interview />
          </div>
        </section>

        <section className="band" aria-labelledby="sequence-heading">
          <p className="band__label">How employment works</p>
          <div className="band__body">
            <h2 className="band__title" id="sequence-heading">
              Six steps, in order, every time.
            </h2>
            <ol className="sequence">
              {SEQUENCE.map(({ title, copy }) => (
                <li className="sequence__step" key={title}>
                  <div>
                    <h3 className="sequence__title">{title}</h3>
                    <p className="sequence__copy">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="band" id="terms" aria-labelledby="terms-heading">
          <p className="band__label">Terms</p>
          <div className="band__body">
            <h2 className="band__title" id="terms-heading">
              Priced like a hire, guaranteed like one.
            </h2>
            <div className="terms">
              {TERMS.map(({ term, gloss }) => (
                <div key={term}>
                  <p className="terms__term">{term}</p>
                  <p className="terms__gloss">{gloss}</p>
                </div>
              ))}
            </div>
            <p className="u-measure u-muted u-sm">
              We publish no numbers we have not earned. Ask on the call and you will get the real
              ones, including the ones that are not flattering yet.
            </p>
          </div>
        </section>

        <section className="band" aria-labelledby="questions-heading">
          <p className="band__label">Questions</p>
          <div className="band__body">
            <h2 className="band__title" id="questions-heading">
              The four every attorney asks.
            </h2>
            <div className="qa">
              {QUESTIONS.map(({ q, a }) => (
                <div className="qa__item" key={q}>
                  <h3 className="qa__q">{q}</h3>
                  <p className="qa__a">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="closing" aria-labelledby="closing-heading">
          <h2 className="closing__title" id="closing-heading">
            Hiring is the part you already know how to do.
          </h2>
          <p className="u-measure u-muted">
            Businesses don’t buy AI. They hire capability. If the inquiries reaching your firm are
            going cold before anyone answers them, that is a staffing problem, and we solve staffing
            problems.
          </p>
          <a className="btn" href="mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20founding%20client">
            Talk to Omar
          </a>
        </section>
      </main>

      <footer className="colophon">
        <p>Tenure, AI Employment Firm</p>
        <p>Every AI employee discloses that it is AI, in every channel.</p>
      </footer>
    </div>
  )
}
