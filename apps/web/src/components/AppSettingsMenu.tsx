import { FC } from 'react'
import { baseButtonStyle } from '../constants/styles'
import { useSettingsStore } from '../stores/settings'
import { matchColorToSelector } from '../helpers/alphaNumericColorMatcher'
import invertColor from 'invert-color'

interface ToggleItem {
  onClick: () => void
  valueText: string
  labelText: string
}

export const AppSettingsMenu: FC = () => {
  const { hasDownload, hasRedirect, toggle } = useSettingsStore()

  const toggleItems: ToggleItem[] = [
    {
      valueText: hasRedirect ? 'enabled' : 'disabled',
      labelText: 'Redirect',
      onClick: () => toggle('hasRedirect'),
    },
    {
      valueText: hasDownload ? 'enabled' : 'disabled',
      labelText: 'Download',
      onClick: () => toggle('hasDownload'),
    },
  ]

  return (
    <div className='flex flex-col bg-gray-700 rounded p-2'>
      <div className='text-sm'>Settings</div>
      {toggleItems.map(({ labelText, valueText, onClick }) => {
        const matchedBgColor = matchColorToSelector(labelText)
        return (
          <div key={labelText} className='p-1'>
            <button
              style={{
                backgroundColor: matchedBgColor,
                color: invertColor(matchedBgColor, true),
              }}
              className={`${
                valueText === 'enabled' ? 'line-through' : ''
              } text-xs ${baseButtonStyle}`}
              aria-label={`${labelText} ${valueText}`}
              onClick={(e) => onClick()}
            >
              {labelText}
            </button>
          </div>
        )
      })}
    </div>
  )
}
