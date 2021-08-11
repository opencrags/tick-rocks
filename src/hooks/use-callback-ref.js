import { useCallback, useLayoutEffect, useRef } from 'react'

export default function useCallbackRef(fn, dependencies = []) {
  // More or less stolen from:
  // https://github.com/chakra-ui/chakra-ui/blob/7e2cb4c344cabf9ddd607a632affd84060dcb424/packages/hooks/src/use-callback-ref.ts
  const ref = useRef(fn)

  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback(
    (...args) => {
      return ref.current?.(...args)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...dependencies]
  )
}
