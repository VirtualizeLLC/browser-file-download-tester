import { FC, MouseEventHandler } from 'react'
import { baseButtonStyle } from '../constants/styles'

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

interface FileGettersProps extends ToggleStateKeys {
  extensionTypes: string[]
  fileName: string
  setBase64Preview: (val: string) => void
}

export const FileGetters: FC<FileGettersProps> = ({
  hasRedirect,
  setBase64Preview,
  extensionTypes,
  fileName,
  hasDownload,
}) => {
  return (
    <div className='flex my-2 flex-wrap gap-2 sm:justify-normal'>
      {extensionTypes.map((extensionType: string) => {
        const anchorLink = getServerFileUrl({
          fetchType: 'blob',
          fileName,
          extensionType,
        })
        return (
          <div key={extensionType} className='flex flex-wrap text-xs'>
            <div className='flex flex-col bg-gray-700 p-4 rounded flex-wrap'>
              <h2 className='underline py-2'>
                {fileName}.{extensionType}
              </h2>
              <span className={`${baseButtonStyle} bg-blue-500`}>
                <a href={anchorLink}>
                  <span>anchor link</span>
                </a>
              </span>
              <span className={`${baseButtonStyle} bg-blue-300`}>
                <a
                  href={anchorLink}
                  target='_blank'
                  rel='noreferrer'
                  download={true}
                >
                  <span>anchor redirect</span>
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
          </div>
        )
      })}
    </div>
  )
}
