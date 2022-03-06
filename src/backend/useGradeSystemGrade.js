import { useBackend } from './useBackend'

export const useGradeSystemGrade = (gradeSystemGradeId) => {
  return useBackend(
    gradeSystemGradeId ? `/grade-system-grades/${gradeSystemGradeId}` : null
  )
}
