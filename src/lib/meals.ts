import type { Guest, Meal } from '../types'

export const MEAL_TO_GUEST_KEY: Record<string, keyof Guest> = {
  'Samedi midi': 'samediMidi',
  'Samedi soir': 'samediSoir',
  'Dimanche brunch': 'dimancheBrunch',
  'Dimanche soir': 'dimancheSoir',
  'Lundi midi': 'lundiMidi',
}

export function convivesForMeal(meal: Meal, guests: Guest[]): Guest[] {
  const key = MEAL_TO_GUEST_KEY[meal.nom]
  if (!key) return []
  return guests.filter((g) => Boolean(g[key]))
}
