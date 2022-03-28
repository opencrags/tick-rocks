import { useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import Grade from '../../components/grade.js'
import { VideoIcon } from '../../components/icons.js'
import Loader from '../../components/loader.js'
import VoteConflictWarning from '../../components/vote-conflict-warning.js'
import { mostVoted, useBetaVideos, useClimb } from '../../utils/backend.js'

export function Climb({ cragId, sectorId, climbId }) {
  const textColor = useColorModeValue('black', 'white')
  const { climb, error } = useClimb(climbId)
  const { betaVideos, error: errorBetaVideos } = useBetaVideos({
    climb_id: climbId,
  })

  if (error || errorBetaVideos) {
    return <Text margin="20px">Failed to load climb.</Text>
  }

  if (climb === undefined) {
    return <Loader />
  }

  return (
    <Link
      as={RouterLink}
      to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`}
    >
      <Flex direction="column" mb="5px">
        <HStack>
          <Text>{mostVoted(climb.name_votes)}</Text>
          {climb.grade_votes.length >= 1 && (
            <Grade gradeId={mostVoted(climb.grade_votes)} />
          )}
          <VoteConflictWarning
            anyVotes={[
              climb.name_votes,
              climb.grade_votes,
              climb.line_path_votes,
            ]}
          />
        </HStack>
        <HStack>
          <Box>
            {betaVideos?.length >= 1 && (
              <Box>
                <VideoIcon color={textColor} />
              </Box>
            )}
          </Box>
          <Box>
            {climb.rating_votes.length >= 1 && (
              <StarRatings
                rating={mostVoted(climb.rating_votes)}
                starRatedColor={
                  climb.rating_votes.length >= 3 ? 'gold' : 'gray'
                }
                numberOfStars={5}
                name="rating"
                starEmptyColor="none"
                starDimension="20px"
                starSpacing="1px"
              />
            )}
          </Box>
        </HStack>
      </Flex>
    </Link>
  )
}
