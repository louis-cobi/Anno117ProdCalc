import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Building {
  name: string
  duration: number
  ratio?: number
}

export interface ProductionChain {
  id: string
  name: string
  buildings: Building[]
  base: number
  createdAt: number
}

interface ProductionStore {
  chains: ProductionChain[]
  addChain: (chain: Omit<ProductionChain, 'id' | 'createdAt'>) => void
  removeChain: (id: string) => void
}

export const useProductionStore = create<ProductionStore>()(
  persist(
    (set) => ({
      chains: [],
      addChain: (chain) =>
        set((state) => ({
          chains: [
            ...state.chains,
            {
              ...chain,
              id: Date.now().toString(),
              createdAt: Date.now(),
            },
          ],
        })),
      removeChain: (id) =>
        set((state) => ({
          chains: state.chains.filter((chain) => chain.id !== id),
        })),
    }),
    {
      name: 'anno117-production-storage',
    }
  )
)

