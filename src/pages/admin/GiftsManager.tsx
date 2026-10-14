import type { SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { friendlyError } from '../../lib/errors'
import { sortGifts } from '../../lib/gifts'
import type { Gift } from '../../lib/types'
import { AddGiftForm } from './AddGiftForm'
import { GiftRow } from './GiftRow'

interface GiftsManagerProps {
  client: SupabaseClient
  gifts: Gift[]
  onChanged: () => void
}

export function GiftsManager({ client, gifts, onChanged }: GiftsManagerProps) {
  const [error, setError] = useState<string | null>(null)
  const categories = Array.from(new Set(gifts.map((g) => g.category))).sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )

  async function run(action: () => PromiseLike<{ error: unknown }>): Promise<boolean> {
    setError(null)
    const { error: err } = await action()
    if (err) setError(friendlyError(err))
    onChanged()
    return !err
  }

  const addGift = (title: string, category: string, quantity: number) => {
    const maxOrder = gifts.filter((g) => g.category === category).reduce((m, g) => Math.max(m, g.sort_order), 0)
    return run(() =>
      client.from('gifts').insert({
        title,
        category,
        total_quantity: quantity,
        available_quantity: quantity,
        sort_order: maxOrder + 10,
      }),
    )
  }

  const updateTotal = (gift: Gift, total: number) =>
    run(() => client.from('gifts').update({ total_quantity: total }).eq('id', gift.id))

  const removeGift = (gift: Gift) => run(() => client.from('gifts').delete().eq('id', gift.id))

  return (
    <section aria-labelledby="presentes-titulo">
      <h2 id="presentes-titulo" className="mb-3 text-lg font-bold text-baby-700">
        Presentes
      </h2>
      <AddGiftForm categories={categories} onAdd={addGift} />
      {error && (
        <p role="alert" className="my-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {sortGifts(gifts).map((gift) => (
          <li key={gift.id}>
            <GiftRow gift={gift} onSaveTotal={updateTotal} onRemove={removeGift} />
          </li>
        ))}
      </ul>
    </section>
  )
}
