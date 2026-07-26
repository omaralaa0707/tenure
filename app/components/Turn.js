// One line of transcript: the opening, each recorded turn, the streaming reply,
// and the failure notice all render as this.
export default function Turn({ who, text, variant = 'candidate', textClassName, ...rest }) {
  return (
    <article className={`turn turn--${variant}`} {...rest}>
      {who && <p className="turn__who">{who}</p>}
      <p className={textClassName ? `turn__text ${textClassName}` : 'turn__text'}>{text}</p>
    </article>
  )
}
