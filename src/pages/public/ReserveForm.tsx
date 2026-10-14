import { useId, useState, type FormEvent } from 'react'

export interface ReserveFormValues {
  name: string
  phone: string
  message: string
}

interface ReserveFormProps {
  sending: boolean
  error: string | null
  onSubmit: (values: ReserveFormValues) => void
  onCancel: () => void
}

export function ReserveForm({ sending, error, onSubmit, onCancel }: ReserveFormProps) {
  const id = useId()
  const [values, setValues] = useState<ReserveFormValues>({ name: '', phone: '', message: '' })
  const [nameError, setNameError] = useState<string | null>(null)

  const update = (field: keyof ReserveFormValues) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }))

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const name = values.name.trim()
    if (!name) {
      setNameError('Por favor, informe seu nome.')
      document.getElementById(`${id}-name`)?.focus()
      return
    }
    setNameError(null)
    onSubmit({ name, phone: values.phone.trim(), message: values.message.trim() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor={`${id}-name`} className="field-label">
          Seu nome <span className="text-rose-600" aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-name`}
          className="field-input"
          value={values.name}
          onChange={(e) => update('name')(e.target.value)}
          maxLength={100}
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? `${id}-name-err` : undefined}
        />
        {nameError && (
          <p id={`${id}-name-err`} className="mt-1 text-sm text-rose-700">
            {nameError}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className="field-label">
          Telefone <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <input
          id={`${id}-phone`}
          type="tel"
          inputMode="tel"
          className="field-input"
          value={values.phone}
          onChange={(e) => update('phone')(e.target.value)}
          maxLength={30}
          autoComplete="tel"
        />
      </div>
      <div>
        <label htmlFor={`${id}-msg`} className="field-label">
          Recado para o Felipe <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <textarea
          id={`${id}-msg`}
          className="field-input min-h-24 resize-y"
          value={values.message}
          onChange={(e) => update('message')(e.target.value)}
          maxLength={500}
          aria-describedby={`${id}-msg-count`}
        />
        <p id={`${id}-msg-count`} className="mt-1 text-right text-xs text-slate-400">
          {values.message.length}/500
        </p>
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={sending}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? 'Confirmando...' : 'Confirmar presente'}
        </button>
      </div>
    </form>
  )
}
