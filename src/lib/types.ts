export interface Gift {
  id: string
  title: string
  category: string
  total_quantity: number
  available_quantity: number
  sort_order: number
  created_at: string
}

export interface Reservation {
  id: string
  gift_id: string
  guest_name: string
  guest_phone: string | null
  message: string | null
  created_at: string
}

export interface ReservationWithGift extends Reservation {
  gifts: Pick<Gift, 'title' | 'category'> | null
}

export interface GiftGroup {
  category: string
  gifts: Gift[]
}
