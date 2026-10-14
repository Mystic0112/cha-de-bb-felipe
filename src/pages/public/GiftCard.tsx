import type { Gift } from '../../lib/types'

interface GiftCardProps {
  gift: Gift
  onChoose: (gift: Gift) => void
}

function remainingLabel(n: number): string {
  return n === 1 ? 'Resta 1' : `Restam ${n}`
}

export function GiftCard({ gift, onChoose }: GiftCardProps) {
  return (
    <article className="card flex h-full items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <h4 className="font-semibold text-slate-800">{gift.title}</h4>
        <p className="mt-0.5 text-sm text-slate-500">
          {remainingLabel(gift.available_quantity)} de {gift.total_quantity}
        </p>
      </div>
      <button
        type="button"
        className="btn-primary shrink-0"
        onClick={() => onChoose(gift)}
        aria-label={`Escolher ${gift.title}`}
      >
        Escolher
      </button>
    </article>
  )
}
