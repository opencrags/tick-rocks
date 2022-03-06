import { useBackend } from './useBackend'

export const useQuickSearch = (text) => {
  return useBackend(`/quick-search?text=${text}`)
}
