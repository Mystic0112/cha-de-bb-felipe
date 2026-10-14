import type { Gift, GiftGroup } from './types'

export function sortGifts(gifts: Gift[]): Gift[] {
  return [...gifts].sort(
    (a, b) =>
      a.category.localeCompare(b.category, 'pt-BR') ||
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title, 'pt-BR'),
  )
}

export function groupByCategory(gifts: Gift[]): GiftGroup[] {
  const groups = new Map<string, Gift[]>()
  for (const gift of sortGifts(gifts)) {
    const list = groups.get(gift.category) ?? []
    list.push(gift)
    groups.set(gift.category, list)
  }
  return Array.from(groups, ([category, items]) => ({ category, gifts: items }))
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(iso),
  )
}
