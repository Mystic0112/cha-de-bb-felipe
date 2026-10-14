import { useId, useState, type FormEvent } from 'react'

interface AddGiftFormProps {
  categories: string[]
  onAdd: (title: string, category: string, quantity: number) => Promise<boolean>
}

export function AddGiftForm({ categories, onAdd }: AddGiftFormProps) {
  const id = useId()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const qty = Number.parseInt(quantity, 10)
    if (!title.trim() || !Number.isFinite(qty) || qty < 1) return
    setSending(true)
    const ok = await onAdd(title.trim(), category.trim() || 'Outros', qty)
    setSending(false)
    if (ok) {
      setTitle('')
      setQuantity('1')
      document.getElementById(`${id}-title`)?.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-3 p-4 sm:grid-cols-[2fr_1.3fr_0.7fr_auto] sm:items-end">
      <div>
        <label htmlFor={`${id}-title`} className="field-label">Novo presente</label>
        <input
          id={`${id}-title`}
          className="field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Ex.: Fralda tamanho M"
          required
        />
      </div>
      <div>
        <label htmlFor={`${id}-cat`} className="field-label">Categoria</label>
        <input
          id={`${id}-cat`}
          className="field-input"
          list={`${id}-cats`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={60}
          placeholder="Ex.: Fraldas"
        />
        <datalist id={`${id}-cats`}>
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div>
        <label htmlFor={`${id}-qty`} className="field-label">Qtd.</label>
        <input
          id={`${id}-qty`}
          type="number"
          inputMode="numeric"
          min={1}
          className="field-input"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn-primary" disabled={sending}>
        {sending ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  )
}
