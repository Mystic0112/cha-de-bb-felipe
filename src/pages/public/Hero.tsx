export function Hero() {
  return (
    <header className="py-10 text-center sm:py-14">
      <div
        aria-hidden="true"
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-baby-100 ring-8 ring-white"
      >
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
          <path d="M8 22h48v6c0 13-11 24-24 24S8 41 8 28v-6z" fill="#fff" stroke="#4f8fd6" strokeWidth="3" strokeLinejoin="round" />
          <path d="M8 22c6 0 10 4 12 10M56 22c-6 0-10 4-12 10" stroke="#4f8fd6" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="18" r="3" fill="#ffc9ad" />
          <circle cx="40" cy="18" r="3" fill="#ffc9ad" />
        </svg>
      </div>
      <p className="text-sm font-semibold tracking-widest text-baby-500 uppercase">Chá de Fraldas</p>
      <h1 className="mt-1 text-4xl font-extrabold text-baby-700 sm:text-5xl">Felipe</h1>
      <p className="mx-auto mt-4 max-w-md text-slate-600">
        Escolha um presente da lista abaixo. Assim que você confirmar, ele é reservado no seu nome
        e some da lista para os outros convidados.
      </p>
    </header>
  )
}
