import { ConfigMissing } from './components/ConfigMissing'
import { useHashRoute } from './hooks/useHashRoute'
import { supabase } from './lib/supabase'
import { AdminPage } from './pages/admin/AdminPage'
import { PublicPage } from './pages/public/PublicPage'

export default function App() {
  const route = useHashRoute()

  if (!supabase) return <ConfigMissing />

  return route === '/admin' ? <AdminPage client={supabase} /> : <PublicPage client={supabase} />
}
