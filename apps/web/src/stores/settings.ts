import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsStore {
  hasRedirect: boolean
  hasDownload: boolean
  toggle(key: keyof Pick<SettingsStore, 'hasDownload' | 'hasRedirect'>): void
}

export const useSettingsStore = create(
  persist<SettingsStore>(
    (set, get) => ({
      hasRedirect: false,
      hasDownload: true,
      toggle: (
        key: keyof Pick<SettingsStore, 'hasDownload' | 'hasRedirect'>
      ) => {
        const keyValue = get()[key]
        if (keyValue === undefined) return

        set({
          [key]: !keyValue,
        })
      },
    }),
    {
      name: 'settings', // name of the item in the storage (must be unique)
      partialize: (state: SettingsStore): any => ({
        hasRedirect: state.hasRedirect,
        hasDownload: state.hasDownload,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
