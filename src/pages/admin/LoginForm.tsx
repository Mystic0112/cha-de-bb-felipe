import type { SupabaseClient } from '@supabase/supabase-js'
import { useId, useState, type FormEvent } from 'react'
import { friendlyError } from '../../lib/errors'

export function LoginForm({ client }: { client: SupabaseClient }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSending(true)
    setError(null)
    const { error: err } = await client.auth.signInWithPassword({ email: email.trim(), password })
    if (err) setError(friendlyError(err))
    setSending(false)
  }

  return (
    <section className="card mx-auto max-w-sm p-6 border-slate-800" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="mb-4 text-xl font-bold text-white text-center">
        Entrar
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`${id}-email`} className="field-label">
            E-mail
          </label>
          <input
            id={`${id}-email`}
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-pass`} className="field-label">
            Senha
          </label>
          <input
            id={`${id}-pass`}
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-rose-950/60 border border-rose-800/80 p-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        <button type="submit" className="btn-primary w-full mt-2" disabled={sending}>
          {sending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
