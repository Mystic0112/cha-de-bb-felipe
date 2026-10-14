import type { Gift } from '../../lib/types'

interface SummaryProps {
  gifts: Gift[]
  reservationsCount: number
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <dt className="text-xs font-semibold text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1 text-2xl font-extrabold text-baby-700">{value}</dd>
    </div>
  )
}

export function Summary({ gifts, reservationsCount }: SummaryProps) {
  const total = gifts.reduce((sum, g) => sum + g.total_quantity, 0)
  const available = gifts.reduce((sum, g) => sum + g.available_quantity, 0)
  const chosen = total - available
  const percent = total > 0 ? Math.round((chosen / total) * 100) : 0

  return (
    <section aria-labelledby="resumo-titulo">
      <h2 id="resumo-titulo" className="mb-3 text-lg font-bold text-baby-700">
        Resumo
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Itens pedidos" value={total} />
        <Stat label="Itens escolhidos" value={chosen} />
        <Stat label="Ainda disponíveis" value={available} />
        <Stat label="Reservas" value={reservationsCount} />
      </dl>
      <div className="mt-3">
        <div
          className="h-3 overflow-hidden rounded-full bg-baby-100"
          role="progressbar"
          aria-label="Progresso da lista"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="h-full rounded-full bg-baby-500 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-1 text-sm text-slate-500">{percent}% da lista já foi escolhida</p>
      </div>
    </section>
  )
}
