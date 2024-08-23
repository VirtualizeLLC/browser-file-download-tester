import {
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

const fileApiBaseUrl = 'http://127.0.0.1:3333'

interface ServerFileUrlParams {
  fetchType: 'blob' | 'base64'
  fileName: string
  extensionType: string
}

interface ToggleStateKeys {
  hasRedirect?: boolean
  hasDownload?: boolean
}

type HandlerClickEvent = Omit<ServerFileUrlParams, 'fetchType'> &
  ToggleStateKeys & {
    verbose?: boolean
  }

const getServerFileUrl = ({
  fileName,
  fetchType,
  extensionType,
}: ServerFileUrlParams) =>
  `${fileApiBaseUrl}/assets/${fetchType}/${fileName}.${extensionType}`

const baseExtensionTypes: string[] = [
  'png',
  'webp',
  'jpg',
  'jpeg',
  'mp4',
  'mp3',
  'wav',
  'mkv',
  'json',
  'json5',
  'md',
  'txt',
  'xml',
]

const baseButtonStyle = 'p-1 mx-2 my-1 rounded-md'
const generatedAsset = 'generated_file'

const fetchFile = async ({
  extensionType,
  fileName,
  verbose,
}: HandlerClickEvent) => {
  const url = getServerFileUrl({
    fetchType: 'blob',
    fileName,
    extensionType,
  })
  try {
    const response = await fetch(url)
    verbose && console.log({ extensionType, response })
    const blob = response?.blob() ?? null
    verbose && console.log({ blobPromise: blob })
    if (!blob) return null
    const blobFileOutput = await blob
    verbose && console.log({ blobFileOutput })
    return blobFileOutput
  } catch (e) {
    console.error('fetchFileError', e)
    return null
  }
}

const handleLinkClick =
  ({
    fileName,
    extensionType,
  }: HandlerClickEvent): MouseEventHandler<HTMLButtonElement> =>
  (e) => {
    e.preventDefault()
    const url = getServerFileUrl({
      fileName,
      fetchType: 'blob',
      extensionType,
    })
    window.location.href = url
  }

const injectAnchorAndDownload = ({
  filePath,
  isBlob,
  extensionType,
}: {
  filePath: string
  isBlob: boolean
  extensionType: string
}) => {
  const a = document.createElement('a')
  a.href = filePath
  const downloadName = isBlob
    ? filePath.split('/').reverse()[0] ?? `file.${extensionType}`
    : `file.${extensionType}`
  a.download = downloadName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const handleBlobClick =
  ({
    fileName,
    extensionType,
    hasRedirect,
    hasDownload,
  }: HandlerClickEvent): MouseEventHandler<HTMLButtonElement> =>
  async (e) => {
    e.preventDefault()
    try {
      const blobOutput = await fetchFile({ extensionType, fileName })
      if (!blobOutput) {
        console.warn('No blob url returned')
        return
      }

      const blobUrl = URL.createObjectURL(blobOutput)
      console.log({ extensionType, blobOutput, blobUrl })
      if (!blobOutput) return

      console.log({ hasDownload, hasRedirect })

      if (hasDownload) {
        injectAnchorAndDownload({
          filePath: blobUrl,
          isBlob: true,
          extensionType,
        })
      } else if (hasRedirect) {
        window.location.href = blobUrl
      }
    } catch (e) {
      console.error('handleBase64Click', e)
    }
  }

const fetchFileBase64 = async ({
  fileName,
  extensionType,
}: Omit<ServerFileUrlParams, 'fetchType'>) => {
  const url = getServerFileUrl({
    fileName,
    fetchType: 'base64',
    extensionType,
  })
  try {
    const response = await fetch(url)
    const base64String = await response.text()
    return base64String
  } catch (e) {
    console.error('fetchFileError', e)
    return null
  }
}

const handleBase64Click =
  ({
    fileName,
    extensionType,
    hasRedirect = false,
    hasDownload,
    verbose = true,
    setBase64Preview,
  }: HandlerClickEvent & {
    setBase64Preview: (val: string) => void
  }): MouseEventHandler<HTMLButtonElement> =>
  async (e) => {
    e.preventDefault()
    try {
      const base64Output = await fetchFileBase64({
        extensionType,
        fileName,
      })
      verbose && console.log({ base64Output })
      if (!base64Output) return

      setBase64Preview(base64Output)
      if (hasDownload) {
        console.log('No download option available for base64Image yet')
        injectAnchorAndDownload({
          filePath: base64Output,
          isBlob: false,
          extensionType,
        })
      } else if (hasRedirect && base64Output) {
        window.location.href = base64Output
      }
    } catch (e) {
      console.error('handleBase64Click', e)
    }
  }

const FileGetters: FC<
  {
    extensionTypes: string[]
    fileName: string
    setBase64Preview: (val: string) => void
  } & ToggleStateKeys
> = ({
  hasRedirect,
  setBase64Preview,
  extensionTypes,
  fileName,
  hasDownload,
}) => {
  return extensionTypes.map((extensionType: string) => {
    const anchorLink = getServerFileUrl({
      fetchType: 'blob',
      fileName,
      extensionType,
    })
    return (
      <div key={extensionType} className='text-xl'>
        <h2 className='underline m-2'>
          {fileName}.{extensionType}
        </h2>
        <span className={`${baseButtonStyle} bg-blue-500`}>
          <a href={anchorLink}>
            <span>anchor link</span>
          </a>
        </span>
        <span className={`${baseButtonStyle} bg-blue-300`}>
          <a href={anchorLink} target='_blank' rel='noreferrer' download={true}>
            <span>anchor redirect (blank)</span>
          </a>
        </span>
        <button
          onClick={handleLinkClick({
            hasRedirect,
            hasDownload,
            fileName,
            extensionType,
          })}
          className={`${baseButtonStyle} bg-blue-300`}
        >
          <div>button redirect</div>
        </button>
        <button
          onClick={handleBlobClick({
            hasRedirect,
            hasDownload,
            fileName,
            extensionType,
          })}
          className={`${baseButtonStyle} bg-orange-500`}
        >
          <div>blob</div>
        </button>
        <button
          onClick={handleBase64Click({
            hasRedirect,
            hasDownload,
            fileName,
            extensionType,
            setBase64Preview,
          })}
          className={`${baseButtonStyle} bg-red-400`}
        >
          <div>base64</div>
        </button>
      </div>
    )
  })
}

const roadSignAsset = 'roadsign-test'
const redirectStorageKey = 'settings_HasRedirect'
const downloadStorageKey = 'settings_HasDownload'

const toggleStateFn =
  (storageKey: string, setState: Dispatch<SetStateAction<boolean>>) => () =>
    setState((val) => {
      const newValue = !val
      localStorage.setItem(storageKey, `${newValue}`)
      return newValue
    })

const useToggleState = ({
  storageKey = '',
  defaultValue,
}: {
  storageKey?: string
  defaultValue?: boolean
}): [boolean, () => void] => {
  const [state, setState] = useState(
    storageKey
      ? localStorage.getItem(storageKey) === 'true'
      : defaultValue || false
  )

  const toggleState = useMemo(
    () => toggleStateFn(storageKey, setState),
    [storageKey]
  )

  return [state, toggleState]
}

interface ToggleItem {
  onClick: () => void
  valueText: string
  labelText: string
}

/**
 * From stackoverflow
 * https://stackoverflow.com/questions/57976898/how-to-get-mime-type-from-base-64-string
 */
const signatures = {
  JVBERi0: 'application/pdf',
  R0lGODdh: 'image/gif',
  R0lGODlh: 'image/gif',
  iVBORw0KGgo: 'image/png',
  '/9j/': 'image/jpg',
}

const detectMimeType = (b64: string) => {
  for (const s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s]
    }
  }
}

export function App() {
  const [hasRedirect, toggleRedirect] = useToggleState({
    storageKey: redirectStorageKey,
    defaultValue: false,
  })
  const [hasDownload, toggleDownload] = useToggleState({
    storageKey: downloadStorageKey,
    defaultValue: true,
  })

  const [base64Preview, setBase64Preview] = useState('')

  const toggleItems: ToggleItem[] = [
    {
      valueText: hasRedirect ? 'enabled' : 'disabled',
      labelText: 'Redirect',
      onClick: toggleRedirect,
    },
    {
      valueText: hasDownload ? 'enabled' : 'disabled',
      labelText: 'Download',
      onClick: toggleDownload,
    },
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold'>Browser Link Tester</h1>
      <div className='py-2 bg-slate-100'>
        <div className='text-xl '>Settings</div>
        {toggleItems.map(({ labelText, valueText, onClick }) => (
          <div key={labelText} className='p-2'>
            <span>{labelText}</span>
            <button
              className={`bg-yellow-400 ${baseButtonStyle}`}
              aria-label={`${labelText} ${valueText}`}
              onClick={(e) => onClick()}
            >
              {valueText}
            </button>
          </div>
        ))}
      </div>
      <div>
        <span>Base64 Preview Image</span>
        <img
          className='max-w-sm	max-h-sm w-6/12'
          src={`data:image/png;base64, ${base64Preview}`}
          alt='Generated base 64'
        />
      </div>
      <FileGetters
        setBase64Preview={setBase64Preview}
        hasDownload={hasDownload}
        hasRedirect={hasRedirect}
        fileName={roadSignAsset}
        extensionTypes={['png', 'webp']}
      />
      <FileGetters
        setBase64Preview={setBase64Preview}
        hasDownload={hasDownload}
        hasRedirect={hasRedirect}
        fileName={generatedAsset}
        extensionTypes={baseExtensionTypes}
      />
    </div>
  )
}

export default App
