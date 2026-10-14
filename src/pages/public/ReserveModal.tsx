import type { SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { friendlyError, isErrorCode } from '../../lib/errors'
import type { Gift } from '../../lib/types'
import { ReserveForm, type ReserveFormValues } from './ReserveForm'

interface ReserveModalProps {
  client: SupabaseClient
  gift: Gift
  onClose: () => void
}

type Status = 'form' | 'sending' | 'success' | 'soldout'

export function ReserveModal({ client, gift, onClose }: ReserveModalProps) {
  const [status, setStatus] = useState<Status>('form')
  const [error, setError] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')

  const soldOutLive = status === 'form' && gift.available_quantity <= 0

  async function handleSubmit(values: ReserveFormValues) {
    setStatus('sending')
    setError(null)
    const { error: err } = await client.rpc('reserve_gift', {
      p_gift_id: gift.id,
      p_guest_name: values.name,
      p_guest_phone: values.phone || null,
      p_message: values.message || null,
    })
    if (!err) {
      setGuestName(values.name.split(' ')[0] ?? values.name)
      setStatus('success')
    } else if (isErrorCode(err, 'GIFT_UNAVAILABLE')) {
      setStatus('soldout')
    } else {
      setError(friendlyError(err))
      setStatus('form')
    }
  }

  if (status === 'success') {
    return (
      <Modal key="success" title="Presente escolhido!" onClose={onClose}>
        <div role="status" className="text-center py-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-baby-100 border border-baby-200 text-baby-600 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-slate-700 dark:text-slate-200 text-base">
            Muito obrigado, <strong className="text-slate-900 dark:text-white">{guestName}</strong>! O presente <strong className="text-baby-700 dark:text-sky-300">{gift.title}</strong>{' '}
            foi reservado para você.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">O Felipe e a família agradecem imensamente o carinho.</p>
          <button type="button" className="btn-primary mt-6 w-full" onClick={onClose}>
            Voltar para a lista
          </button>
        </div>
      </Modal>
    )
  }

  if (status === 'soldout' || soldOutLive) {
    return (
      <Modal key="soldout" title="Presente esgotado" onClose={onClose}>
        <div className="py-2 text-center">
          <p role="alert" className="text-slate-700 dark:text-slate-300">
            Que pena! Alguém acabou de escolher a última unidade de <strong className="text-slate-900 dark:text-white">{gift.title}</strong>.
            Que tal escolher outro item da lista?
          </p>
          <button type="button" className="btn-primary mt-6 w-full" onClick={onClose}>
            Ver outros presentes
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal key="form" title={`Escolher: ${gift.title}`} onClose={onClose} locked={status === 'sending'}>
      <ReserveForm sending={status === 'sending'} error={error} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  )
}
