export function ConfigMissing() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg items-center p-6">
      <section className="card w-full p-8 text-center border-slate-800" role="alert">
        <h1 className="mb-3 text-xl font-bold text-white">Site ainda não configurado</h1>
        <p className="mb-4 text-slate-300">
          A lista de presentes está quase pronta! Falta conectar ao banco de dados.
        </p>
        <p className="text-sm text-slate-400">
          Organizador: defina <code className="rounded bg-slate-800 text-sky-400 px-1.5 py-0.5">VITE_SUPABASE_URL</code> e{' '}
          <code className="rounded bg-slate-800 text-sky-400 px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code> no arquivo{' '}
          <code className="rounded bg-slate-800 text-sky-400 px-1.5 py-0.5">.env</code> (local) ou nos secrets do GitHub
          (deploy). Veja o README.
        </p>
      </section>
    </main>
  )
}
