import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import Loader from './loader.js'
import {
  useCrag,
  useSector,
  useClimb,
  useLines,
  useImage,
} from '../utils/backend.js'
import LineImage from './line-image.js'

export default function Climb(props) {
  const cragId = props.match.params.cragId
  const sectorId = props.match.params.sectorId
  const climbId = props.match.params.climbId
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const { climb, error: errorClimb } = useClimb(climbId)
  const { lines, error: errorLines } = useLines(
    climbId ? { climb_id: climbId } : null
  )

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

  const linesSortedByImage = lines.reduce(
    (sorted, line) =>
      sorted[line.image_id]
        ? {
            ...sorted,
            [line.image_id]: [...sorted[line.image_id], line],
          }
        : { ...sorted, [line.image_id]: [line] },
    {}
  )

  const imagesWithLines = Object.entries(linesSortedByImage).map(
    ([id, lines]) => ({ id, lines })
  )

  return (
    <Container maxWidth="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="sm">Crag: {crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="sm">Sector: {sector.name_votes[0].value}</Heading>
      </Link>
      <Heading size="md">{climb.name_votes[0].value}</Heading>
      <VStack>
        {imagesWithLines.map((imageWithLines) => (
          <ImageWithLines
            key={imageWithLines.id}
            crag={crag}
            sector={sector}
            imageWithLines={imageWithLines}
          />
        ))}
      </VStack>
    </Container>
  )
}

function ImageWithLines({ crag, sector, imageWithLines }) {
  const { image, error: errorImage } = useImage(imageWithLines.id)

  if (errorImage) {
    return (
      <Center>
        <Text margin="20px">Failed to load image.</Text>
      </Center>
    )
  }

  if (image === undefined) {
    return <Loader />
  }

  return (
    <Box>
      <Link
        as={RouterLink}
        to={`/crags/${crag.id}/sectors/${sector.id}/images/${image.id}`}
      >
        <Heading size="sm">{image.id}</Heading>
      </Link>
      <LineImage image={image} lines={imageWithLines.lines} />
      {imageWithLines.lines.map((line) => (
        <Text key={line.id}>Line path: {line.line_path_votes[0].value}</Text>
      ))}
    </Box>
  )
}
