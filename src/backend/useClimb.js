import { useBackend } from './useBackend'

export const useClimb = (climbId) => {
  const {
    data: climb,
    error,
    mutate,
  } = useBackend(climbId ? `/climbs/${climbId}` : null)
  return { climb, error, mutate }
}
