import { MouseEventHandler } from 'react'

const fileApiBaseUrl = 'http://127.0.0.1:3333'

interface ServerFileUrlParams {
  fetchType: 'blob' | 'base64'
  fileName: string
  extensionType: string
}

type HandlerClickEvent = Omit<ServerFileUrlParams, 'fetchType'> & {
  hasRedirect?: boolean
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

const handleBlobClick =
  ({
    fileName,
    extensionType,
    hasRedirect,
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

      if (hasRedirect && blobOutput) {
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
  }: HandlerClickEvent): MouseEventHandler<HTMLButtonElement> =>
  async (e) => {
    e.preventDefault()
    try {
      const base64Output = await fetchFileBase64({
        extensionType,
        fileName,
      })
      console.log({ base64Output })
      if (hasRedirect && base64Output) {
        window.location.href = base64Output
      }
    } catch (e) {
      console.error('handleBase64Click', e)
    }
  }

const generateFileGetters = (fileName: string, extensionTypes: string[]) => {
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
          <a href={anchorLink} target='_blank' rel='noreferrer'>
            <span>anchor redirect (blank)</span>
          </a>
        </span>
        <button
          onClick={handleLinkClick({ fileName, extensionType })}
          className={`${baseButtonStyle} bg-blue-300`}
        >
          <div>button redirect</div>
        </button>
        <button
          onClick={handleBlobClick({ fileName, extensionType })}
          className={`${baseButtonStyle} bg-orange-500`}
        >
          <div>blob</div>
        </button>
        <button
          onClick={handleBase64Click({ fileName, extensionType })}
          className={`${baseButtonStyle} bg-red-400`}
        >
          <div>base64</div>
        </button>
      </div>
    )
  })
}

const roadSignAsset = 'roadsign-test'

export function App() {
  return (
    <div>
      <h1>Browser Link Tester"</h1>
      {generateFileGetters(roadSignAsset, ['png', 'webp'])}
      {generateFileGetters(generatedAsset, baseExtensionTypes)}
    </div>
  )
}

export default App
