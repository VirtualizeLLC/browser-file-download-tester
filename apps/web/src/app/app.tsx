import { useState } from 'react'
import { ExtensionSelector } from '../components/ExtensionSelector'
import { useSelectedExtensionStore } from '../stores/selectedExtensions'
import { Base64ImagePreview } from '../components/Base64ImageLoader'
import { AppSettingsMenu } from '../components/AppSettingsMenu'
import { useSettingsStore } from '../stores/settings'
import { FileGetters } from '../components/FileGetters'

const roadSignAsset = 'roadsign-test'
export function App() {
  const { selectedExtensions } = useSelectedExtensionStore()
  const { hasDownload, hasRedirect } = useSettingsStore()
  const [base64Preview, setBase64Preview] = useState('')

  return (
    <div className='bg-gray-600 min-h-screen light:text-white dark:text-gray-200 p-2'>
      <h1 className='md:text-xl lg:text-2xl font-bold'>Browser Link Tester</h1>
      <div className='flex'>
        <div className='flex flex-col flex-grow'>
          <ExtensionSelector />
        </div>
      </div>
      {selectedExtensions.length > 0 && (
        <div className='flex justify-between'>
          <AppSettingsMenu />
          <Base64ImagePreview data={base64Preview} />
        </div>
      )}
      <FileGetters
        setBase64Preview={setBase64Preview}
        hasDownload={hasDownload}
        hasRedirect={hasRedirect}
        fileName={roadSignAsset}
        extensionTypes={selectedExtensions}
      />
    </div>
  )
}

export default App
