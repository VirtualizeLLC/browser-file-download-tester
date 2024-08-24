import { FC } from 'react'

export const Base64ImagePreview: FC<{ data: string }> = ({ data }) => {
  return (
    <div className='w-24 h-24 mx-2 flex items-center text-center border-round-200 rounded bg-gray-800 justify-center'>
      {!data && <span className='text-white'>Base64 Preview Image </span>}

      {data && (
        <img
          className='max-w-sm	max-h-sm w-6/12'
          src={`data:image/png;base64, ${data}`}
          alt='Generated base 64'
        />
      )}
    </div>
  )
}
