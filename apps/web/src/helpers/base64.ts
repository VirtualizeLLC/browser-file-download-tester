import { fileTypeFromBuffer } from "file-type"

/**
 * @description Leverages fileTypeFromBuffer to determine the incoming stream's type
 */
const detectFileType =async (b64: ArrayBuffer) => {
  const type = await fileTypeFromBuffer(b64)
  return type
}
