import type { Gift } from '../../lib/types'

interface SummaryProps {
  gifts: Gift[]
  reservationsCount: number
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4.5 border-baby-100 dark:border-slate-800">
      <dt className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">{label}</dt>
      <dd className="mt-1.5 text-2xl font-black text-baby-700 dark:text-white">{value}</dd>
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
      <h2 id="resumo-titulo" className="mb-3 text-lg font-bold text-baby-700 dark:text-white">
        Resumo
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Itens pedidos" value={total} />
        <Stat label="Itens escolhidos" value={chosen} />
        <Stat label="Ainda disponíveis" value={available} />
        <Stat label="Reservas" value={reservationsCount} />
      </dl>
      <div className="mt-4 card p-4 border-baby-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Progresso de presentes escolhidos</span>
          <span className="font-bold text-baby-600 dark:text-sky-400">{percent}%</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-baby-100 dark:bg-slate-950 border border-baby-200 dark:border-slate-800"
          role="progressbar"
          aria-label="Progresso da lista"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-baby-500 to-baby-600 dark:from-sky-500 dark:to-cyan-300 transition-all shadow-sm" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </section>
  )
}
