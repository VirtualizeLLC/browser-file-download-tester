import { Dispatch, SetStateAction, useMemo, useState } from 'react'

const toggleStateFn =
  (storageKey: string, setState: Dispatch<SetStateAction<boolean>>) => () =>
    setState((val) => {
      const newValue = !val
      localStorage.setItem(storageKey, `${newValue}`)
      return newValue
    })

export const useToggleState = ({
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
