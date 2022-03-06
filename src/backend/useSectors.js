import { useQuery } from './useQuery'

export const useSectors = (query, limit = 20, offset = 0) => {
  return useQuery('sectors', query, limit, offset)
}
