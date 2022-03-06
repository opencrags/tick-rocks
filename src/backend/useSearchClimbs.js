import { useBackend } from './useBackend'

export const useSearchClimbs = (body, params) => {
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return useBackend(`/search-climbs?${paramString}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
