/**
 * @Todo add a dictionary explaining each and every extension and if they are deprecated etc.
 */

export const executableExtensions = ['exe', 'sh', 'zsh', 'ps1']

export const programExtensions = [
  'json',
  'json5',
  'java',
  'kt',
  'swift',
  'py',
  'xml',
  'bin',
]

// could fall under programmatic extensions
export const applicationExtensions = ['exe', 'apk', 'ipa']

export const fontExtensions = ['tff', 'otf', 'woff', 'woff2']

export const backups = ['bak', 'old', 'orig']

export const audioExtensions = ['mp3', 'wav']
// might need to fall under video extensions
export const codecExtensions = ['h261', 'h263', 'h264']
export const imageExtensions = ['png', 'webp', 'jpg', 'jpeg', 'jxl', 'img']

/**
 * @mng is older than apng
 */
export const animatedImageExtensions = ['webp', 'apng', 'gif', 'mng']

export const videoExtensions = [
  'mp4',
  'avi',
  'wav',
  'mkv',
  'aac',
  'mov',
  'movie',
]

export const compressionExtensions = [
  'lz4', // compression file
  'zstd', // zstandard file
  'lz4', // compression file (not a archive)
  'bz2', // bzip2
  'bzip2', // bzip2
]

export const archiveExtensions = [
  '7z', // https://en.wikipedia.org/wiki/7-Zip
  'archive', // https://en.wikipedia.org/wiki/Archive_file
  'dmg', // https://en.wikipedia.org/wiki/Apple_Disk_Image
  'tar', // https://en.wikipedia.org/wiki/Tar_(computing)
  /* Zip // https://en.wikipedia.org/wiki/ZIP_(file_format) */
  'zipx',
  'zstd',
  'z01',
  'zx01',
  /* end zip */
]

export const documentExtensions = [
  'txt', // text file
  'rtf', // rich text
  'odf', // OpenDocument
  'doc', // microsoft word document
  'docx', // macos microsoft word document
  'md', // markdown
  'pdf', // pdf
  'psd', // photoshop
  'ppt', // powerpoint
]

/**
 * pdf can be included here
 */
export const readerExtensions = ['epub', 'pdf', 'mobi']

export const mediaExtensions = [
  ...imageExtensions,
  ...videoExtensions,
  ...audioExtensions,
]

export const allExtensionTypes: string[] = [
  ...imageExtensions,
  ...videoExtensions,
  ...audioExtensions,
  ...programExtensions,
  ...archiveExtensions,
  ...documentExtensions,
  ...animatedImageExtensions,
  ...executableExtensions,
]
