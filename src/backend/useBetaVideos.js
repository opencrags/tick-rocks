import { useQuery } from './useQuery'

export const useBetaVideos = (query, limit = 20, offset = 0) =>
  useQuery('beta_videos', query, limit, offset)
