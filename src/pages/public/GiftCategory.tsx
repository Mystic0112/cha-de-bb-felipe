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
      <div className="mb-3.5 flex items-center gap-2.5 px-1">
        <span className="h-2 w-2 rounded-full bg-baby-500 dark:bg-sky-400 shadow-sm" aria-hidden="true" />
        <h3 id={headingId} className="text-lg font-bold tracking-wide text-baby-700 dark:text-slate-100">
          {group.category}
        </h3>
      </div>
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
