import { useQuery } from './useQuery'

export const useCrags = (query, limit = 20, offset = 0) => {
  return useQuery('crags', query, limit, offset)
}
