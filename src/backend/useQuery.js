import { useBackend } from './useBackend'

export const useQuery = (collection, query, limit, offset) =>
  useBackend(
    collection && query
      ? `/${collection}/query?limit=${limit}&offset=${offset}`
      : null,
    {
      method: 'POST',
      body: JSON.stringify(query),
    }
  )
