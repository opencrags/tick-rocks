import { useBackend } from './useBackend'

export const useSector = (sectorId) => {
  return useBackend(sectorId ? `/sectors/${sectorId}` : null)
}
