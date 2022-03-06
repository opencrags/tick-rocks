import { useBackend } from './useBackend'

const useCrag = (cragId) => {
  return useBackend(cragId ? `/crags/${cragId}` : null)
}
