import { useQuery } from './useQuery'

export const useCragPhotos = (query, limit = 20, offset = 0) => {
  return useQuery('crag_photos', query, limit, offset)
}
