import type { SupabaseClient } from '@supabase/supabase-js'
import { useMemo, useState } from 'react'
import { StatusMessage } from '../../components/StatusMessage'
import { useGifts } from '../../hooks/useGifts'
import { groupByCategory } from '../../lib/gifts'
import type { Gift } from '../../lib/types'
import { GiftCategory } from './GiftCategory'
import { Hero } from './Hero'
import { ReserveModal } from './ReserveModal'

export function PublicPage({ client }: { client: SupabaseClient }) {
  const { gifts, loading, error, reload } = useGifts(client, 'public-gifts')
  const [selected, setSelected] = useState<Gift | null>(null)

  const groups = useMemo(
    () => groupByCategory(gifts.filter((g) => g.available_quantity > 0)),
    [gifts],
  )
  // Mantem dados atualizados do item aberto no modal (quantidade em tempo real)
  const liveSelected = selected ? (gifts.find((g) => g.id === selected.id) ?? selected) : null

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <Hero />
      <main id="lista" aria-labelledby="lista-titulo">
        <h2 id="lista-titulo" className="sr-only">
          Lista de presentes
        </h2>
        {loading && <StatusMessage kind="loading">Carregando a lista de presentes...</StatusMessage>}
        {!loading && error && (
          <StatusMessage kind="error" onRetry={() => void reload()}>
            {error}
          </StatusMessage>
        )}
        {!loading && !error && groups.length === 0 && (
          <StatusMessage kind="empty">
            Todos os presentes já foram escolhidos. Muito obrigado pelo carinho!
          </StatusMessage>
        )}
        <div className="space-y-8">
          {groups.map((group) => (
            <GiftCategory key={group.category} group={group} onChoose={setSelected} />
          ))}
        </div>
      </main>
      <footer className="mt-16 text-center text-xs text-slate-500">
        Feito com carinho para o Felipe ·{' '}
        <a href="#/admin" className="text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-sky-400 hover:decoration-sky-400 transition-colors">
          Área do organizador
        </a>
      </footer>
      {liveSelected && (
        <ReserveModal client={client} gift={liveSelected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
