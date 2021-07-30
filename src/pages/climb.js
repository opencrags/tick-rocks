import {
  Container,
  Center,
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Progress,
  Link,
  Button,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import Grade from '../components/grade.js'
import {
  useClimb,
  useLines,
  useImage,
  countVotes,
  mostVoted,
} from '../utils/backend.js'
import LineImage from '../components/line-image.js'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'

export default function Climb() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { lines, error: errorLines } = useLines({ climb_id: climbId })

  if (errorClimb || errorLines) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load climb.</Text>
        </Center>
      </Container>
    )
  }

  if (climb === undefined || lines === undefined) {
    return <Loader />
  }

  const countedGradeVotes = countVotes(climb.grade_votes)
  const maxGradeVoteCount = Math.max(Object.values(countedGradeVotes))

  return (
    <Container maxWidth="container.md">
      <ClimbBreadcrumb climbId={climbId} />
      <Heading size="lg">
        {mostVoted(climb.name_votes)}
        <EditButton
          to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-name`}
        />
      </Heading>
      <Heading size="sm">Grade votes</Heading>
      {countedGradeVotes.length === 0 ? (
        <Text>There are no grade votes.</Text>
      ) : (
        countedGradeVotes.map((vote) => (
          <Box key={vote.value}>
            <HStack>
              <Grade gradeId={vote.value} />
              <Text>({vote.count} votes)</Text>
            </HStack>
            <Progress value={vote.count / maxGradeVoteCount} />
          </Box>
        ))
      )}
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-grade`}
      >
        <Button>Add grade vote</Button>
      </Link>
      {lines.length === 0 ? (
        <Text>There are no drawn lines for this climb.</Text>
      ) : (
        <VStack>
          {lines.map((line) => (
            <ImageWithLines key={line.id} line={line} />
          ))}
        </VStack>
      )}
      <Text>
        If you want to add a line then go to the image you want to draw the line
        on and then select this climb.
      </Text>
    </Container>
  )
}

function ImageWithLines({ line }) {
  const { image, error: errorImage } = useImage(line.image_id)
  // const { lines: otherLines, error: errorOtherLines } = useLines({ image_id: line.image_id })

  if (errorImage) {
    return (
      <Center>
        <Text margin="20px">Failed to load image/lines.</Text>
      </Center>
    )
  }

  if (image === undefined) {
    return <Loader />
  }

  return (
    <Box marginTop="20px">
      <LineImage image={image} lines={[line]} />
    </Box>
  )
}
