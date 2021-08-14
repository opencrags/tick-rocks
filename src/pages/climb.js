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
  LinkBox,
  Button,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
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

import {
  CragBanner,
  CragBannerMenu,
  CragBannerMenuButton,
} from '../components/crag-banner.js'

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
    <Container maxWidth="100%" mt={{ base: '55px', md: '0px' }} padding="0">
      <CragBanner cragId={cragId}>
        <ClimbBreadcrumb climbId={climbId} />
        <Heading size="xl">
          {climb.name_votes.length >= 1
            ? mostVoted(climb.name_votes)
            : 'No name votes'}
          <LinkBox
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-name`}
          >
            <Box as="sup">
              <EditButton />
              <VoteConflictWarning votes={climb.name_votes} />
            </Box>
          </LinkBox>
        </Heading>
        <Heading size="lg">
          <Grade gradeId={mostVoted(climb.grade_votes)} />
          <LinkBox
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-grade`}
          >
            <Box as="sup">
              <EditButton />
              <VoteConflictWarning votes={climb.grade_votes} />
            </Box>
          </LinkBox>
        </Heading>
        <Heading size="sm">
          {climb.rating_votes.length >= 1
            ? mostVoted(climb.rating_votes) + ' / 5 stars'
            : 'No rating votes'}
          <LinkBox
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-rating`}
          >
            <Box as="sup">
              <EditButton />
            </Box>
          </LinkBox>
        </Heading>
      </CragBanner>
      <CragBannerMenu>Edit</CragBannerMenu>
      <Container maxWidth="container.md">
        <Box margin="10px 0px">
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
        </Box>
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
          If you want to add a line then go to the image you want to draw the
          line on and then select this climb.
        </Text>
      </Container>
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
