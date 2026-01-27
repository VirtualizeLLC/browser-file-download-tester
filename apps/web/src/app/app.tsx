import { useState, useEffect } from 'react'
import { ExtensionSelector } from '../components/ExtensionSelector'
import { useSelectedExtensionStore } from '../stores/selectedExtensions'
import { Base64ImagePreview } from '../components/Base64ImageLoader'
import { AppSettingsMenu } from '../components/AppSettingsMenu'
import { useSettingsStore } from '../stores/settings'
import { FileGetters, resetAllCache } from '../components/FileGetters'
import { baseButtonStyle } from '../constants/styles'
import { mediaExtensions } from '../constants/availableExtensionTypes'
import { generationOptionsFromListOfValues } from '../components/Selector'

const TOP_SECTION_STORAGE_KEY = 'app_top_section_expanded'

export function App() {
  const { selectedExtensions, update } = useSelectedExtensionStore()
  const { hasDownload, hasRedirect } = useSettingsStore()
  const [base64Preview, setBase64Preview] = useState('')
  const [isTopSectionExpanded, setIsTopSectionExpanded] = useState(() => {
    const stored = localStorage.getItem(TOP_SECTION_STORAGE_KEY)
    return stored ? JSON.parse(stored) : true
  })

  useEffect(() => {
    localStorage.setItem(TOP_SECTION_STORAGE_KEY, JSON.stringify(isTopSectionExpanded))
  }, [isTopSectionExpanded])

  const handleResetCache = () => {
    resetAllCache()
    window.location.reload()
  }

  return (
    <div className='bg-gray-600 min-h-screen light:text-white dark:text-gray-200 p-2'>
      <div className='flex justify-between items-center gap-2 flex-wrap'>
        <h1 className='md:text-xl lg:text-2xl font-bold text-white'>
          Browser Link Tester
        </h1>
        <div className='flex gap-2 flex-wrap justify-end'>
          <button
            className={`text-xs bg-slate-900 text-white ${baseButtonStyle}`}
            onClick={() =>
              update(generationOptionsFromListOfValues(mediaExtensions))
            }
          >
            Add all extensions
          </button>
          <button
            className={`text-xs bg-red-700 text-white ${baseButtonStyle}`}
            onClick={handleResetCache}
          >
            Reset cache
          </button>
        </div>
      </div>

      <div className='mb-3'>
        <button
          onClick={() => setIsTopSectionExpanded(!isTopSectionExpanded)}
          className='flex items-center gap-2 text-sm font-semibold text-white hover:text-gray-200'
        >
          <span>{isTopSectionExpanded ? '▼' : '▶'}</span>
          <span>Configuration</span>
        </button>

        {isTopSectionExpanded && (
          <>
            <div className='flex flex-col flex-grow mt-2'>
              <ExtensionSelector />
            </div>
            {selectedExtensions.length > 0 && (
              <div className='flex mt-2 gap-2 flex-wrap'>
                <AppSettingsMenu />
                <Base64ImagePreview data={base64Preview} />
              </div>
            )}
          </>
        )}
      </div>

      <FileGetters
        setBase64Preview={setBase64Preview}
        hasDownload={hasDownload}
        hasRedirect={hasRedirect}
        extensionTypes={selectedExtensions}
      />
    </div>
  )
}

export default App
