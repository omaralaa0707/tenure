// Eyebrow, title, lede: the same three lines open every section.
export default function SectionHead({ id, eyebrow, title, lede }) {
  return (
    <div className="section__head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section__title" id={id}>
        {title}
      </h2>
      {lede && <p className="section__lede">{lede}</p>}
    </div>
  )
}
