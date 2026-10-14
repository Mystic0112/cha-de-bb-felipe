const KNOWN_ERRORS: Record<string, string> = {
  GIFT_UNAVAILABLE: 'Que pena! Alguém acabou de escolher a última unidade deste presente.',
  INVALID_NAME: 'Informe seu nome (até 100 caracteres).',
  INVALID_PHONE: 'O telefone deve ter no máximo 30 caracteres.',
  INVALID_MESSAGE: 'O recado deve ter no máximo 500 caracteres.',
  NOT_AUTHORIZED: 'Você precisa estar logado para fazer isso.',
  RESERVATION_NOT_FOUND: 'Esta reserva já foi cancelada.',
  TOTAL_BELOW_RESERVED: 'A quantidade total não pode ser menor que a quantidade já escolhida.',
  'Invalid login credentials': 'E-mail ou senha incorretos.',
}

export function isErrorCode(error: unknown, code: string): boolean {
  return errorText(error).includes(code)
}

function errorText(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return typeof error === 'string' ? error : ''
}

/** Converte erros do Supabase/Postgres em mensagens amigaveis em portugues. */
export function friendlyError(error: unknown): string {
  const text = errorText(error)
  const match = Object.keys(KNOWN_ERRORS).find((code) => text.includes(code))
  if (match) return KNOWN_ERRORS[match] ?? text
  if (text.toLowerCase().includes('failed to fetch')) {
    return 'Não foi possível conectar. Verifique sua internet e tente de novo.'
  }
  return 'Algo deu errado. Tente novamente em instantes.'
}
