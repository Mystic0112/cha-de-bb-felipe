import type { Gift, GiftGroup } from '../../lib/types'
import { GiftCard } from './GiftCard'

interface GiftCategoryProps {
  group: GiftGroup
  onChoose: (gift: Gift) => void
}

export function GiftCategory({ group, onChoose }: GiftCategoryProps) {
  const headingId = `cat-${group.category.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="mb-3 px-1 text-lg font-bold text-baby-700">
        {group.category}
      </h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {group.gifts.map((gift) => (
          <li key={gift.id}>
            <GiftCard gift={gift} onChoose={onChoose} />
          </li>
        ))}
      </ul>
    </section>
  )
}
