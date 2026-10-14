import type { SupabaseClient } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { friendlyError } from '../lib/errors'
import type { Gift } from '../lib/types'

interface GiftsState {
  gifts: Gift[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

function applyChange(list: Gift[], eventType: string, next: Partial<Gift>, old: Partial<Gift>) {
  if (eventType === 'DELETE') return list.filter((g) => g.id !== old.id)
  const gift = next as Gift
  const exists = list.some((g) => g.id === gift.id)
  return exists ? list.map((g) => (g.id === gift.id ? { ...g, ...gift } : g)) : [...list, gift]
}

/** Carrega os presentes e mantem a lista sincronizada via Supabase Realtime. */
export function useGifts(client: SupabaseClient, channelName: string): GiftsState {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const { data, error: err } = await client.from('gifts').select('*')
    if (err) setError(friendlyError(err))
    else {
      setGifts((data ?? []) as Gift[])
      setError(null)
    }
    setLoading(false)
  }, [client])

  useEffect(() => {
    void reload()
    const channel = client
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, (payload) => {
        setGifts((list) =>
          applyChange(list, payload.eventType, payload.new as Partial<Gift>, payload.old as Partial<Gift>),
        )
      })
      .subscribe((status) => {
        // Ao reconectar, recarrega para nao perder eventos ocorridos offline
        if (status === 'SUBSCRIBED') void reload()
      })
    return () => {
      void client.removeChannel(channel)
    }
  }, [client, channelName, reload])

  return { gifts, loading, error, reload }
}
