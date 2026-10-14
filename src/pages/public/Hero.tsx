export function Hero() {
  return (
    <header className="py-10 text-center sm:py-14">
      <div
        aria-hidden="true"
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shadow-sky-500/10 ring-4 ring-sky-500/10"
      >
        <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none">
          {/* Berco / Nuvem estilizada moderna */}
          <path d="M12 26h40v6c0 11-9 20-20 20s-20-9-20-20v-6z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M12 26c5 0 9 4 10 9M52 26c-5 0-9 4-10 9" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="20" r="2.5" fill="#38bdf8" />
          <circle cx="38" cy="20" r="2.5" fill="#38bdf8" />
          <path d="M32 10l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#facc15" />
        </svg>
      </div>
      <p className="text-xs font-bold tracking-[0.25em] text-sky-400 uppercase">
        Chá de Fraldas
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
        Felipe
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-slate-400 leading-relaxed">
        Escolha um presente da lista abaixo. Assim que você confirmar, ele é reservado no seu nome
        e some da lista para os outros convidados.
      </p>
    </header>
  )
}
