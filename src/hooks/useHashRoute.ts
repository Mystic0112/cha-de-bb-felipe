import { useEffect, useState } from 'react'

function readRoute(): string {
  const path = window.location.hash.replace(/^#/, '') || '/'
  return path.startsWith('/') ? path : `/${path}`
}

/** Roteamento minimo por hash (#/ e #/admin), compativel com GitHub Pages. */
export function useHashRoute(): string {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
