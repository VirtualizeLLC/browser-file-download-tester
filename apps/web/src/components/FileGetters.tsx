import { FC, MouseEventHandler, useState, useEffect } from 'react'
import { baseButtonStyle } from '../constants/styles'

const fileApiBaseUrl = 'http://127.0.0.1:3333'

const STORAGE_KEYS = {
  QUERIES: 'fg_queries',
  QUERY_SECTION: 'fg_query_expanded',
  FILES_SECTION: 'fg_files_expanded',
  TOP_SECTION: 'fg_top_expanded',
}

export const resetAllCache = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
  localStorage.removeItem('app_top_section_expanded')
  localStorage.removeItem('saved_extensions')
}

const uriEncodedCharacter = encodeURIComponent(':')

const getInitialQueries = () => {
  const fileName = `name${uriEncodedCharacter}BLAH_of-icon+override+othervalue_180LR`
  const stored = localStorage.getItem(STORAGE_KEYS.QUERIES)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return [
        { name: 'fn=""', query: `fn="${fileName}"` },
        { name: 'filename%3D', query: `filename%3D${fileName}` },
        { name: 'filename=', query: `filename=${fileName}` },
      ]
    }
  }
  return [
    { name: 'fn=""', query: `fn="${fileName}"` },
    { name: 'filename%3D', query: `filename%3D${fileName}` },
    { name: 'filename=', query: `filename=${fileName}` },
  ]
}

interface ServerFileUrlParams {
  fetchType: 'blob' | 'base64'
  fileName: string
  extensionType: string
  query?: string
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
  query,
}: ServerFileUrlParams) => {
  const base = `${fileApiBaseUrl}/assets/${fetchType}/${fileName}.${extensionType}`
  return query && query.length > 0 ? `${base}?${query}` : base
}

const fetchFile = async ({
  extensionType,
  fileName,
  verbose,
  query,
}: HandlerClickEvent) => {
  const url = getServerFileUrl({
    fetchType: 'blob',
    fileName,
    extensionType,
    query,
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
    query,
  }: HandlerClickEvent): MouseEventHandler<HTMLButtonElement> =>
  (e) => {
    e.preventDefault()
    const url = getServerFileUrl({
      fileName,
      fetchType: 'blob',
      extensionType,
      query,
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
    query,
  }: HandlerClickEvent): MouseEventHandler<HTMLButtonElement> =>
  async (e) => {
    e.preventDefault()
    try {
      const blobOutput = await fetchFile({ extensionType, fileName, query })
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
  query,
}: Omit<ServerFileUrlParams, 'fetchType'>) => {
  const url = getServerFileUrl({
    fileName,
    fetchType: 'base64',
    extensionType,
    query,
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
    query,
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
        query,
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
  queryName: string
  setBase64Preview: (val: string) => void
}


const fileName = 'roadsign-test'

export const FileGetters: FC<FileGettersProps> = ({
  hasRedirect,
  setBase64Preview,
  extensionTypes,
  hasDownload,
}) => {
  const [queries, setQueries] = useState<Array<{ name: string; query: string }>>(getInitialQueries())
  const [newName, setNewName] = useState<string>('')
  const [newQuery, setNewQuery] = useState<string>('')
  const [query, setQuery] = useState<string>('')
  const [isQuerySectionExpanded, setIsQuerySectionExpanded] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.QUERY_SECTION)
    return stored ? JSON.parse(stored) : false
  })
  const [isFilesSectionExpanded, setIsFilesSectionExpanded] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FILES_SECTION)
    return stored ? JSON.parse(stored) : false
  })
  const [isTopSectionExpanded, setIsTopSectionExpanded] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TOP_SECTION)
    return stored ? JSON.parse(stored) : true
  })

  // Persist queries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries))
  }, [queries])

  // Persist expansion states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUERY_SECTION, JSON.stringify(isQuerySectionExpanded))
  }, [isQuerySectionExpanded])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILES_SECTION, JSON.stringify(isFilesSectionExpanded))
  }, [isFilesSectionExpanded])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOP_SECTION, JSON.stringify(isTopSectionExpanded))
  }, [isTopSectionExpanded])

  const addQuery = () => {
    if (!newName || !newQuery) return
    setQueries((s) => [...s, { name: newName, query: newQuery }])
    setNewName('')
    setNewQuery('')
  }

  const removeQuery = (idx: number) => {
    setQueries((s) => s.filter((_, i) => i !== idx))
  }

  return (
    <div className='flex my-2 flex-wrap gap-3 sm:gap-2 w-full'>
      <div className='w-full mb-3'>
        <button
          onClick={() => setIsQuerySectionExpanded(!isQuerySectionExpanded)}
          className='flex items-center gap-2 w-full mb-2 text-sm font-semibold text-white hover:text-gray-200'
        >
          <span>{isQuerySectionExpanded ? '▼' : '▶'}</span>
          <span>Query presets</span>
        </button>

        {isQuerySectionExpanded && (
          <>
            <div className='flex flex-col sm:flex-row gap-2 mb-3 p-2 bg-gray-800 rounded'>
              <input
                className='flex-1 p-2 rounded text-sm text-white bg-gray-700 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-0'
                placeholder='name (shorthand)'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                className='flex-1 p-2 rounded text-sm text-white bg-gray-700 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-0'
                placeholder='query string'
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
              />
              <button
                className={`${baseButtonStyle} bg-green-500 shrink-0`}
                onClick={addQuery}
              >
                Add
              </button>
            </div>

            <div className='flex gap-2 flex-wrap p-2 bg-gray-800 rounded'>
              {queries.map((q, idx) => (
                <div
                  key={`${q.name}-${idx}`}
                  className='flex items-center gap-2 bg-gray-700 px-2 py-1 rounded text-xs'
                >
                  <span className='text-white font-medium'>{q.name}</span>
                  <span className='text-gray-300 truncate'>{q.query}</span>
                  <button
                    className='text-red-300 ml-1 hover:text-red-400'
                    onClick={() => removeQuery(idx)}
                    aria-label={`remove ${q.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className='w-full'>
        <button
          onClick={() => setIsFilesSectionExpanded(!isFilesSectionExpanded)}
          className='flex items-center gap-2 w-full mb-3 text-sm font-semibold text-white hover:text-gray-200'
        >
          <span>{isFilesSectionExpanded ? '▼' : '▶'}</span>
          <span>File Downloads</span>
        </button>

        {isFilesSectionExpanded && (
          <div className='flex flex-wrap gap-3 sm:gap-2'>
            {extensionTypes.map((extensionType: string) => {
              const anchorLink = getServerFileUrl({
                fetchType: 'blob',
                fileName: fileName,
                extensionType,
                query,
              })
              return (
                <div key={extensionType} className='w-full sm:w-auto'>
                  <div className='flex flex-col bg-gray-700 p-3 rounded text-xs'>
                    <h2 className='underline py-2 font-semibold'>
                      {fileName}.{extensionType}
                    </h2>
                    <span className={`${baseButtonStyle} bg-blue-500 text-sm`}>
                      <a href={anchorLink}>
                        <span>anchor link</span>
                      </a>
                    </span>
                    <span className={`${baseButtonStyle} bg-blue-300 text-sm`}>
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
                        query,
                      })}
                      className={`${baseButtonStyle} bg-blue-300 text-sm`}
                    >
                      <div>button redirect</div>
                    </button>
                    <button
                      onClick={handleBlobClick({
                        hasRedirect,
                        hasDownload,
                        fileName,
                        extensionType,
                        query,
                      })}
                      className={`${baseButtonStyle} bg-orange-500 text-sm`}
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
                        query,
                      })}
                      className={`${baseButtonStyle} bg-red-400 text-sm`}
                    >
                      <div>base64</div>
                    </button>
                    <div className='flex gap-2 flex-wrap mt-3'>
                      {queries.map((q, i) => (
                        <a
                          key={`${q.name}-${i}`}
                          className={`${baseButtonStyle} bg-green-500 text-xs sm:text-sm`}
                          href={getServerFileUrl({
                            fetchType: 'blob',
                            fileName,
                            extensionType,
                            query: q.query,
                          })}
                        >
                          <span>{q.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
