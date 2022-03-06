import { useBackend } from './useBackend'

export const useImage = (imageId) => {
  return useBackend(imageId ? `/images/${imageId}` : null)
}
