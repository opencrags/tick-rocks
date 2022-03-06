import { useBackend } from './useBackend'

export const useClimb = (climbId) =>
  useBackend(climbId ? `/climbs/${climbId}` : null)
