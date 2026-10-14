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
    <article className="card group flex h-full items-center justify-between gap-3 p-4 hover:border-baby-300 dark:hover:border-slate-700 transition-all">
      <div className="min-w-0">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-baby-700 dark:group-hover:text-white transition-colors">
          {gift.title}
        </h4>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-baby-600 dark:text-sky-400">{remainingLabel(gift.available_quantity)}</span>{' '}
          <span className="text-slate-400 dark:text-slate-500">de {gift.total_quantity}</span>
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
