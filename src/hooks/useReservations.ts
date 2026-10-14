import type { SupabaseClient } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { friendlyError } from '../lib/errors'
import type { ReservationWithGift } from '../lib/types'

/** Carrega reservas (com titulo do presente). Disponivel apenas para usuario autenticado (RLS). */
export function useReservations(client: SupabaseClient) {
  const [reservations, setReservations] = useState<ReservationWithGift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const { data, error: err } = await client
      .from('reservations')
      .select('id, gift_id, guest_name, guest_phone, message, created_at, gifts(title, category)')
      .order('created_at', { ascending: false })
    if (err) setError(friendlyError(err))
    else {
      setReservations((data ?? []) as unknown as ReservationWithGift[])
      setError(null)
    }
    setLoading(false)
  }, [client])

  useEffect(() => {
    void reload()
  }, [reload])

  return { reservations, loading, error, reload }
}
