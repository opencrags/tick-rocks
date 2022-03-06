import { useQuery } from './useQuery'

export const useBetaVideos = (query, limit = 20, offset = 0) => {
  const { data: betaVideos, error } = ('beta_videos', query, limit, offset)
  return { betaVideos, error }
}
