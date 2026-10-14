import { useEffect, useId, useState, type FormEvent } from 'react'
import type { Gift } from '../../lib/types'

interface GiftRowProps {
  gift: Gift
  onSaveTotal: (gift: Gift, total: number) => Promise<boolean>
  onRemove: (gift: Gift) => Promise<boolean>
}

export function GiftRow({ gift, onSaveTotal, onRemove }: GiftRowProps) {
  const id = useId()
  const [total, setTotal] = useState(String(gift.total_quantity))
  const [busy, setBusy] = useState(false)
  const reserved = gift.total_quantity - gift.available_quantity
  const parsed = Number.parseInt(total, 10)
  const dirty = parsed !== gift.total_quantity

  useEffect(() => setTotal(String(gift.total_quantity)), [gift.total_quantity])

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (!Number.isFinite(parsed) || parsed < 0) return
    setBusy(true)
    await onSaveTotal(gift, parsed)
    setBusy(false)
  }

  async function handleRemove() {
    const warn = reserved > 0 ? ` As ${reserved} reserva(s) deste item também serão apagadas.` : ''
    if (!window.confirm(`Remover "${gift.title}"?${warn}`)) return
    setBusy(true)
    await onRemove(gift)
    setBusy(false)
  }

  return (
    <form onSubmit={handleSave} className="card flex flex-wrap items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-800">{gift.title}</p>
        <p className="text-xs text-slate-500">
          {gift.category} · {reserved} escolhido(s) · {gift.available_quantity} disponível(is)
        </p>
      </div>
      <label htmlFor={`${id}-total`} className="text-sm text-slate-600">
        Total
      </label>
      <input
        id={`${id}-total`}
        type="number"
        inputMode="numeric"
        min={reserved}
        className="field-input w-20 py-1.5"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        aria-describedby={`${id}-hint`}
      />
      <span id={`${id}-hint`} className="sr-only">
        Mínimo {reserved}, pois já há itens escolhidos.
      </span>
      <button type="submit" className="btn-ghost px-3 py-1.5 text-xs" disabled={busy || !dirty}>
        Salvar
      </button>
      <button type="button" className="btn-danger px-3 py-1.5 text-xs" onClick={() => void handleRemove()} disabled={busy}>
        Remover
      </button>
    </form>
  )
}
