import { FC } from 'react'
import { generationOptionsFromListOfValues, Selector } from './Selector'
import { useSelectedExtensionStore } from '../stores/selectedExtensions'

export const ExtensionSelector: FC = () => {
  const { availableExtensions, selectedExtensions, isSelected, update } =
    useSelectedExtensionStore()
  return (
    <div>
      <Selector
        placeholder={'Select Extensions to Test'}
        onChange={update}
        isSelected={isSelected}
        selectedOptions={generationOptionsFromListOfValues(selectedExtensions)}
        availableOptions={generationOptionsFromListOfValues(
          availableExtensions
        )}
      />
      {selectedExtensions.length === 0 && (
        <div className='text-sm text-orange-400 my-2'>
          No extensions selected.
        </div>
      )}
    </div>
  )
}
