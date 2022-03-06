import { useQuery } from './useQuery'

export const useAscents = (query, limit = 20, offset = 0) =>
  useQuery('ascents', query, limit, offset)
