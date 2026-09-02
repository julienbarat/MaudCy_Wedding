import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { loadData, saveData } from './client'
import { emptyData } from './emptyData'
import type { WeddingData } from '../types'

export type SaveStatus = 'chargement' | 'prêt' | 'enregistrement' | 'enregistré' | 'erreur'

interface DataContextValue {
  data: WeddingData
  status: SaveStatus
  update: (updater: (data: WeddingData) => WeddingData) => void
}

const DataContext = createContext<DataContextValue | null>(null)

const SAVE_DEBOUNCE_MS = 700

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WeddingData | null>(null)
  const [status, setStatus] = useState<SaveStatus>('chargement')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestData = useRef<WeddingData | null>(null)

  useEffect(() => {
    loadData()
      .then((d) => {
        setData(d)
        setStatus('prêt')
      })
      .catch(() => {
        setData(emptyData())
        setStatus('prêt')
      })
  }, [])

  const scheduleSave = useCallback((next: WeddingData) => {
    latestData.current = next
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setStatus('enregistrement')
      try {
        await saveData(latestData.current as WeddingData)
        setStatus('enregistré')
      } catch {
        setStatus('erreur')
      }
    }, SAVE_DEBOUNCE_MS)
  }, [])

  const update = useCallback(
    (updater: (data: WeddingData) => WeddingData) => {
      setData((current) => {
        if (!current) return current
        const next = updater(current)
        scheduleSave(next)
        return next
      })
    },
    [scheduleSave],
  )

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--color-text)]">
        Chargement…
      </div>
    )
  }

  return <DataContext.Provider value={{ data, status, update }}>{children}</DataContext.Provider>
}

export function useWeddingData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useWeddingData doit être utilisé sous DataProvider')
  return ctx
}
