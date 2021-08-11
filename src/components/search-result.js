import { Box, Link, Skeleton, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { mostVoted, useGradeSystemGrade } from '../utils/backend'

export default function SearchResult({ climb }) {
  const { grade, error } = useGradeSystemGrade(mostVoted(climb.grade_votes))

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

  return (
    <Box>
      <Link
        as={RouterLink}
        to={`/crags/${climb.crag_id}/sectors/${climb.sector_id}/climbs/${climb.climb_id}`}
      >
        {mostVoted(climb.name_votes)}, {grade.grade}
      </Link>
    </Box>
  )
}
