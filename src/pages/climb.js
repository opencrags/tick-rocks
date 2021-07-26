import {
  Container,
  Center,
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Progress,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import Grade from '../components/grade.js'
import {
  useCrag,
  useSector,
  useClimb,
  useLines,
  useImage,
  countVotes,
} from '../utils/backend.js'
import LineImage from '../components/line-image.js'

export default function Climb() {
  const { cragId, sectorId, climbId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const { climb, error: errorClimb } = useClimb(climbId)
  const { lines, error: errorLines } = useLines({ climb_id: climbId })

  if (errorCrag || errorSector || errorClimb || errorLines) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load climb.</Text>
        </Center>
      </Container>
    )
  }

  if (
    crag === undefined ||
    sector === undefined ||
    climb === undefined ||
    lines === undefined
  ) {
    return <Loader />
  }

  const countedGradeVotes = countVotes(climb.grade_votes)
  const maxGradeVoteCount = Math.max(Object.values(countedGradeVotes))

  return (
    <Container maxWidth="container.md">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/crags/${cragId}`}>
            {crag.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}`}
          >
            {sector.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Text>{climb.name_votes[0].value}</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading size="lg">
        {climb.name_votes[0].value}
        <EditButton
          to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-name`}
        />
      </Heading>
      <Heading size="sm">Grade votes</Heading>
      {countedGradeVotes.map((vote) => (
        <Box key={vote.value}>
          <HStack>
            <Grade gradeId={vote.value} />
            <Text>({vote.count} votes)</Text>
          </HStack>
          <Progress value={vote.count / maxGradeVoteCount} />
        </Box>
      ))}
      <VStack>
        {lines.map((line) => (
          <ImageWithLines
            key={line.id}
            crag={crag}
            sector={sector}
            climb={climb}
            line={line}
          />
        ))}
      </VStack>
    </Container>
  )
}

function ImageWithLines({ crag, sector, climb, line }) {
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
    <Box>
      <LineImage image={image} lines={[line]} />
    </Box>
  )
}
