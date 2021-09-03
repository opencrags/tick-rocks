import { Text, Skeleton } from '@chakra-ui/react'
import { useGradeSystemGrade } from '../utils/backend'
export default function GradeColor({ gradeId }) {
  const { grade, error } = useGradeSystemGrade(gradeId)

  if (error) {
    return 'gray'
  }
  if (grade === undefined) {
    return 'white'
  }
  if (grade === '3') {
    return 'green.100'
  }
  if (grade === '4') {
    return 'green.200'
  }
  if (grade === '4+') {
    return 'green.300'
  }
  if (grade === '5') {
    return 'blue.100'
  }
  if (grade === '5+') {
    return 'blue.200'
  }
  if (grade === '6A') {
    return 'red.200'
  }
  if (grade === '6A+') {
    return 'red.300'
  }
  if (grade === '6B') {
    return 'red.400'
  }
  if (grade === '6B+') {
    return 'red.500'
  }
  if (grade === '6C') {
    return 'Red.600'
  }
  if (grade === '6C+') {
    return 'green.300'
  } else return 'blue'
}
