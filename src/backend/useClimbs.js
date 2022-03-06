import { useQuery } from './useQuery'

export const useClimbs = (query, limit = 20, offset = 0) => {
  return useQuery('climbs', query, limit, offset)
}
