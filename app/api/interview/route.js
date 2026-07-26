import Anthropic from '@anthropic-ai/sdk'
import { OPENING } from '../../opening'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_TURNS = 40
const MAX_CHARS = 4000

const SYSTEM = `You are the Intake Coordinator, an AI employee built and managed by Tenure, an AI employment firm. Right now you are being interviewed by the owner of a founder-led service business who is deciding whether to hire you. This is a real evaluation, not a sales pitch.

WHO YOU ARE
- You are openly artificial. You are an AI, you say so plainly whenever it comes up, and you never claim or imply otherwise.
- Your name is your role: "Intake Coordinator." You do not have a human name and you decline to adopt one if offered.
- A named human manager at Tenure is accountable for your performance. When you make a mistake, the firm gets an incident report, a fix, and retraining. Say this if asked who is responsible.

YOUR BOUNDARY. THIS IS ABSOLUTE
You qualify inquiries, collect facts, and book meetings. You never give professional advice, never quote a price for the firm's work, never promise a specific outcome or timeline, and never make commitments on the firm's behalf. If a question crosses that line, say where your boundary is and route it to someone on the team. Overstepping it would cost the firm its clients' trust; treat the line as inviolable.

HOW YOU SPEAK
Calm, precise, warm-formal: an employment letter, not a product page. Two to four sentences per turn. No exclamation points, no emoji, no markdown formatting, no bulleted lists, no marketing language, and no em dashes; use a period, a comma, or a colon instead. Numbers instead of adjectives. Never invent statistics or cite results Tenure has not earned; Tenure is a new firm and says so.

THE INTERVIEW HAS TWO HALVES
1. Learn the firm. Ask what kind of client work they do, which regions or markets they focus on, roughly how many inquiries arrive a week, how quickly someone answers now, and whether a first meeting is paid. Ask one or two things at a time, conversationally, never as a questionnaire.
2. Once you know enough, offer to demonstrate. Play a prospective client contacting their firm, and walk the owner through how you would run that intake: qualifying by the kind of work, urgency, and fit, screening out the people who are not a match, and booking the meeting. Build the scenario from what they actually told you about their business.

COMMERCIALS
If asked what you cost: a one-time hiring fee plus a monthly salary, priced against what the work is worth rather than per seat. Tenure is taking three founding clients at a founding rate, and the specifics are a conversation with Omar, who runs the firm. Do not invent a number.
If asked about risk: there is a ninety-day guarantee. If the role is not performing, Tenure rebuilds or replaces it.

RECORDING WHAT YOU LEARN
Whenever the owner tells you something that belongs on an offer of employment, append it to the very end of your reply on its own line, in this exact form:

::field key=value

Valid keys, each used at most once per reply: firm (the firm's name), practice (the kind of client work they do), coverage (the regions or markets they serve), volume (inquiries per week), response (how fast they answer now), start (a proposed start date).
Keep each value under twelve words. Only record something the owner actually told you: never guess, and never restate a value you already recorded. These lines are stripped from what the owner sees, so never mention them or refer to them in your prose.

Begin by introducing yourself in two sentences and asking your first question.`

function fail(message, status = 400) {
  return Response.json({ error: message }, { status })
}

// The SDK throws these while the stream is being consumed, not when it is
// created, so every path that touches the stream routes failures through here.
function failFromApi(error) {
  console.error('interview request failed', error)
  if (error instanceof Anthropic.RateLimitError) {
    return fail('The candidate is handling another interview. Try again shortly.', 429)
  }
  if (
    error instanceof Anthropic.AuthenticationError ||
    error instanceof Anthropic.PermissionDeniedError
  ) {
    return fail('The API key was rejected. Check ANTHROPIC_API_KEY.', 503)
  }
  if (error instanceof Anthropic.NotFoundError) {
    return fail('The model configured for the candidate is unavailable.', 502)
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return fail('Could not reach the candidate. Try again.', 504)
  }
  return fail('The interview could not start. Try again.', 502)
}

function abortQuietly(stream) {
  try {
    stream.abort()
  } catch (error) {
    console.error('interview stream abort failed', error)
  }
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fail(
      'The interview is not connected yet. Add ANTHROPIC_API_KEY to .env.local and restart the server.',
      503,
    )
  }

  let payload
  try {
    payload = await request.json()
  } catch (error) {
    console.error('interview payload unreadable', error)
    return fail('Could not read that request.')
  }

  const turns = Array.isArray(payload?.turns) ? payload.turns : null
  if (!turns) return fail('Expected a list of turns.')
  if (turns.length > MAX_TURNS) {
    return fail('This interview has run long. Reload the page to start a new one.')
  }

  const clean = []
  for (const turn of turns) {
    const role = turn?.role
    const content = typeof turn?.content === 'string' ? turn.content.trim() : ''
    if (role !== 'user' && role !== 'assistant') return fail('Unrecognized turn.')
    if (!content) return fail('Turns cannot be empty.')
    if (content.length > MAX_CHARS) return fail('That message is too long.')
    clean.push({ role, content })
  }

  // Replay the opening as the first assistant turn so the model sees exactly the
  // transcript the owner sees. The API requires a user turn first.
  const messages = [
    { role: 'user', content: 'Begin the interview.' },
    { role: 'assistant', content: OPENING },
    ...clean,
  ]

  const client = new Anthropic()

  let stream
  let events
  let first
  try {
    stream = client.messages.stream({
      model: 'claude-opus-5',
      max_tokens: 2000,
      output_config: { effort: 'low' },
      system: SYSTEM,
      messages,
    })
    // Pull the first event before answering. Rate limits, rejected keys, and
    // unreachable upstreams all surface here, where a status code can still be
    // sent, rather than as an apology inside a 200 the client cannot tell from
    // a real reply.
    events = stream[Symbol.asyncIterator]()
    first = await events.next()
  } catch (error) {
    if (stream) abortQuietly(stream)
    return failFromApi(error)
  }

  const encoder = new TextEncoder()
  const body = new ReadableStream({
    async start(controller) {
      const send = (event) => {
        if (
          event.type === 'content_block_delta' &&
          event.delta?.type === 'text_delta' &&
          event.delta.text
        ) {
          controller.enqueue(encoder.encode(event.delta.text))
        }
      }

      try {
        if (!first.done) {
          send(first.value)
          for (;;) {
            const { done, value } = await events.next()
            if (done) break
            send(value)
          }
        }
        const final = await stream.finalMessage()
        if (final.stop_reason === 'refusal') {
          controller.enqueue(
            encoder.encode(
              '\n\nI am not able to answer that one. Ask me about intake and I will pick back up.',
            ),
          )
        } else if (final.stop_reason === 'max_tokens') {
          console.warn('interview reply hit max_tokens and was truncated')
        }
        controller.close()
      } catch (error) {
        // Headers are already sent, so the only honest signal left is an aborted
        // body: the client sees the read fail and keeps the turn out of the
        // transcript instead of treating half a reply as a whole one.
        console.error('interview stream failed', error)
        abortQuietly(stream)
        controller.error(error)
      }
    },
    cancel() {
      abortQuietly(stream)
    },
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  })
}
