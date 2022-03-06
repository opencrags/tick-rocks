import { useBackend } from './useBackend'

export const useUser = (userId) =>
  useBackend(userId ? `/users/${userId}` : null)
