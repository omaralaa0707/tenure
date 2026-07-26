// Eyebrow, title, lede: the same three lines open every section. Pass
// className={null} where the heading shares a column with other content.
export default function SectionHead({
  id,
  eyebrow,
  title,
  lede,
  className = 'section__head',
  children,
}) {
  return (
    <div className={className ?? undefined}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section__title" id={id}>
        {title}
      </h2>
      {lede && <p className="section__lede">{lede}</p>}
      {children}
    </div>
  )
}
