import type { SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { StatusMessage } from '../../components/StatusMessage'
import { downloadCsv, reservationsToCsv } from '../../lib/csv'
import { friendlyError } from '../../lib/errors'
import { formatDateTime } from '../../lib/gifts'
import type { ReservationWithGift } from '../../lib/types'

interface ReservationsTableProps {
  client: SupabaseClient
  reservations: ReservationWithGift[]
  loading: boolean
  error: string | null
  onChanged: () => void
}

export function ReservationsTable({ client, reservations, loading, error, onChanged }: ReservationsTableProps) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function cancel(r: ReservationWithGift) {
    const ok = window.confirm(`Cancelar a reserva de ${r.guest_name} (${r.gifts?.title ?? 'presente'})?`)
    if (!ok) return
    setBusyId(r.id)
    setActionError(null)
    const { error: err } = await client.rpc('cancel_reservation', { p_reservation_id: r.id })
    if (err) setActionError(friendlyError(err))
    setBusyId(null)
    onChanged()
  }

  function exportCsv() {
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`reservas-cha-felipe-${date}.csv`, reservationsToCsv(reservations))
  }

  return (
    <section aria-labelledby="reservas-titulo">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="reservas-titulo" className="text-lg font-bold text-baby-700 dark:text-white">
          Reservas
        </h2>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={onChanged}>
            Atualizar
          </button>
          <button type="button" className="btn-primary" onClick={exportCsv} disabled={reservations.length === 0}>
            Exportar CSV
          </button>
        </div>
      </div>
      {actionError && (
        <p role="alert" className="mb-3 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/60 dark:border-rose-800/80 p-3 text-sm text-rose-700 dark:text-rose-300">
          {actionError}
        </p>
      )}
      {loading && <StatusMessage kind="loading">Carregando reservas...</StatusMessage>}
      {!loading && error && <StatusMessage kind="error">{error}</StatusMessage>}
      {!loading && !error && reservations.length === 0 && (
        <StatusMessage kind="empty">Nenhuma reserva ainda.</StatusMessage>
      )}
      {!loading && !error && reservations.length > 0 && (
        <div className="card overflow-x-auto border-baby-100 dark:border-slate-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Lista de reservas dos convidados</caption>
            <thead className="bg-baby-50 border-b border-baby-100 dark:bg-slate-950/70 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">Convidado</th>
                <th scope="col" className="px-4 py-3">Telefone</th>
                <th scope="col" className="px-4 py-3">Presente</th>
                <th scope="col" className="px-4 py-3">Recado</th>
                <th scope="col" className="px-4 py-3">Data/hora</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-baby-100 dark:divide-slate-800/70">
              {reservations.map((r) => (
                <tr key={r.id} className="align-top hover:bg-baby-50/50 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{r.guest_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">{r.guest_phone ?? '-'}</td>
                  <td className="px-4 py-3 text-baby-700 dark:text-sky-300 font-medium">{r.gifts?.title ?? '(removido)'}</td>
                  <td className="max-w-xs px-4 py-3 break-words whitespace-pre-line text-slate-600 dark:text-slate-300">{r.message ?? '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">{formatDateTime(r.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="btn-danger px-3 py-1.5 text-xs"
                      onClick={() => void cancel(r)}
                      disabled={busyId === r.id}
                      aria-label={`Cancelar reserva de ${r.guest_name}`}
                    >
                      {busyId === r.id ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
