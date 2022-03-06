import { useBackend } from './useBackend'

export const useLine = (lineId) => {
  return useBackend(lineId ? `/lines/${lineId}` : null)
}
