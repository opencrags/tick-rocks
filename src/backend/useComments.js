import { useBackend } from './useBackend'

const useComments = (relatedId, limit = 20, offset = 0) => {
  return useBackend(
    relatedId
      ? `/comments?related_id=${relatedId}&limit=${limit}&offset=${offset}`
      : null
  )
}
