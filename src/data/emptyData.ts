import type { WeddingData } from '../types'

export function emptyData(): WeddingData {
  return {
    guests: [],
    guestFields: [],
    venues: [],
    meals: [],
    vendors: [],
    budget: [],
    tables: [],
    timeline: [],
    tasks: [],
    ideas: [],
  }
}
