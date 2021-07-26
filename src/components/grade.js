import { Text, Skeleton } from '@chakra-ui/react'

import { useGradeSystemGrade } from '../utils/backend.js'

export default function Grade({ gradeId }) {
  const { grade, error } = useGradeSystemGrade(gradeId)

  if (error) {
    return <Text>Failed to load grade.</Text>
  }

  if (grade === undefined) {
    return (
      <Skeleton>
        <Text>?</Text>
      </Skeleton>
    )
  }

  return <Text>{grade.grade}</Text>
}
