import type { SupabaseClient } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { StatusMessage } from '../../components/StatusMessage'
import { useGifts } from '../../hooks/useGifts'
import { useReservations } from '../../hooks/useReservations'
import { GiftsManager } from './GiftsManager'
import { ReservationsTable } from './ReservationsTable'
import { Summary } from './Summary'

export function Dashboard({ client }: { client: SupabaseClient }) {
  const giftsState = useGifts(client, 'admin-gifts')
  const resState = useReservations(client)
  const { reload: reloadReservations } = resState

  // Quando um presente muda (nova reserva em tempo real), atualiza a tabela de reservas
  const giftsSignature = giftsState.gifts.map((g) => `${g.id}:${g.available_quantity}`).join('|')
  useEffect(() => {
    void reloadReservations()
  }, [giftsSignature, reloadReservations])

  if (giftsState.loading) return <StatusMessage kind="loading">Carregando painel...</StatusMessage>
  if (giftsState.error) {
    return (
      <StatusMessage kind="error" onRetry={() => void giftsState.reload()}>
        {giftsState.error}
      </StatusMessage>
    )
  }

  return (
    <div className="space-y-8">
      <Summary gifts={giftsState.gifts} reservationsCount={resState.reservations.length} />
      <ReservationsTable
        client={client}
        reservations={resState.reservations}
        loading={resState.loading}
        error={resState.error}
        onChanged={() => void resState.reload()}
      />
      <GiftsManager client={client} gifts={giftsState.gifts} onChanged={() => void giftsState.reload()} />
    </div>
  )
}
