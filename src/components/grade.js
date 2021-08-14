import { Text, Skeleton } from '@chakra-ui/react'

import { useGradeSystemGrade } from '../utils/backend.js'

export default function Grade({ gradeId }) {
  const { grade, error } = useGradeSystemGrade(gradeId)

  if (error) {
    return <span>Failed to load grade.</span>
  }

  if (grade === undefined) {
    return (
      <Skeleton as="span">
        <span>?</span>
      </Skeleton>
    )
  }

  return <span>{grade.grade}</span>
}
