import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { StatusMessage } from '../../components/StatusMessage'
import { Dashboard } from './Dashboard'
import { LoginForm } from './LoginForm'

export function AdminPage({ client }: { client: SupabaseClient }) {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    void client.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data } = client.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [client])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-baby-500 uppercase">
            Chá de Fraldas do Felipe
          </p>
          <h1 className="text-2xl font-extrabold text-baby-700">Painel do organizador</h1>
        </div>
        <nav className="flex gap-2">
          <a href="#/" className="btn-ghost">
            Ver lista pública
          </a>
          {session && (
            <button type="button" className="btn-ghost" onClick={() => void client.auth.signOut()}>
              Sair
            </button>
          )}
        </nav>
      </header>
      {checking && <StatusMessage kind="loading">Verificando sessão...</StatusMessage>}
      {!checking && !session && <LoginForm client={client} />}
      {!checking && session && <Dashboard client={client} />}
    </div>
  )
}
