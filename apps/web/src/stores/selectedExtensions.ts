import { create } from 'zustand'
import {
  persist,
  createJSONStorage,
  PersistOptions,
  PersistStorage,
} from 'zustand/middleware'
import { OptionProps } from 'react-select'

import { SelectorProps } from './../components/Selector'
import {
  imageExtensions,
  mediaExtensions,
} from '../constants/availableExtensionTypes'

interface SelectedExtensionsStore {
  availableExtensions: string[]
  selectedExtensions: string[]
  selectedExtensionsSet: Set<string>
  isSelected: SelectorProps['isSelected']
  update: SelectorProps['onChange']
  clear: () => void
}

const defaultExtensions = [...imageExtensions]

export const useSelectedExtensionStore = create(
  persist<SelectedExtensionsStore>(
    (set, get) => ({
      availableExtensions: mediaExtensions,
      selectedExtensions: defaultExtensions,
      get selectedExtensionsSet() {
        return new Set(get()?.selectedExtensions ?? [])
      },
      isSelected: (option: OptionProps): boolean => {
        const extensionSet = get().selectedExtensionsSet
        const hasExtension = extensionSet.has(option.label)

        return hasExtension
      },
      update: (newValue, actionMeta) => {
        if (!Array.isArray(newValue)) return
        const data = newValue.map(({ value }) => value)
        const dedupedData = [...new Set(data)]
        set({
          selectedExtensions: dedupedData,
        })
      },
      clear: () => set({ selectedExtensions: [] }),
      reset: () => set({ selectedExtensions: defaultExtensions }),
    }),
    {
      name: 'saved_extensions', // name of the item in the storage (must be unique)
      partialize: (state: any): any => ({
        selectedExtensions: state.selectedExtensions,
      }),
      onRehydrateStorage: (state) => {
        return (_completedState, error) => {
          if (error) {
            console.log('an error happened during hydration', error)
          }
        }
      },
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
