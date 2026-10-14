export function ConfigMissing() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg items-center p-6">
      <section className="card w-full p-8 text-center" role="alert">
        <h1 className="mb-3 text-xl font-bold text-baby-700">Site ainda não configurado</h1>
        <p className="mb-4">
          A lista de presentes está quase pronta! Falta conectar ao banco de dados.
        </p>
        <p className="text-sm text-slate-500">
          Organizador: defina <code className="rounded bg-baby-50 px-1">VITE_SUPABASE_URL</code> e{' '}
          <code className="rounded bg-baby-50 px-1">VITE_SUPABASE_ANON_KEY</code> no arquivo{' '}
          <code className="rounded bg-baby-50 px-1">.env</code> (local) ou nos secrets do GitHub
          (deploy). Veja o README.
        </p>
      </section>
    </main>
  )
}
