import { useBackend } from './useBackend'

const useGradeSystemGrades = () => {
  return useBackend('/grade-system-grades')
}
