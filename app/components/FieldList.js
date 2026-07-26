// Label/value rows: the sample offer in the hero, the role scorecard, and the
// live offer letter are all this shape. `block` picks the BEM block whose
// `__row`, `__key`, and `__value` styles apply.
const TAGS = {
  plain: { List: 'div', Row: 'div', Key: 'span', Value: 'span' },
  definition: { List: 'dl', Row: 'div', Key: 'dt', Value: 'dd' },
}

export default function FieldList({ block, fields, variant = 'plain', className }) {
  const { List, Row, Key, Value } = TAGS[variant]
  return (
    <List className={className ?? `${block}__list`}>
      {fields.map(({ key, label, value, state }) => (
        <Row className={`${block}__row`} key={key ?? label}>
          <Key className={`${block}__key`}>{label}</Key>
          <Value className={`${block}__value`} data-state={state}>
            {value}
          </Value>
        </Row>
      ))}
    </List>
  )
}
