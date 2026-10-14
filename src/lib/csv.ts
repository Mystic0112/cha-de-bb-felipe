import { formatDateTime } from './gifts'
import type { ReservationWithGift } from './types'

function escapeCell(value: string): string {
  // Evita injecao de formula em planilhas (=, +, -, @)
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export function reservationsToCsv(rows: ReservationWithGift[]): string {
  const header = ['Convidado', 'Telefone', 'Presente', 'Categoria', 'Recado', 'Data/hora']
  const lines = rows.map((r) =>
    [
      r.guest_name,
      r.guest_phone ?? '',
      r.gifts?.title ?? '',
      r.gifts?.category ?? '',
      r.message ?? '',
      formatDateTime(r.created_at),
    ]
      .map(escapeCell)
      .join(';'),
  )
  return [header.map(escapeCell).join(';'), ...lines].join('\r\n')
}

export function downloadCsv(filename: string, content: string): void {
  // BOM para o Excel reconhecer UTF-8 (acentos)
  const blob = new Blob(['\uFEFF', content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
