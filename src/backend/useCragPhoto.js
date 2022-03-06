import { useBackend } from './useBackend'

export const useCragPhoto = (cragPhotoId) => {
  return useBackend(cragPhotoId ? `/crag_photos/${cragPhotoId}` : null)
}
