import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  useCrag,
  useSector,
  useClimb,
  useLines,
  useImage,
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

  // const linesSortedByImage = lines.reduce(
  //   (sorted, line) =>
  //     sorted[line.image_id]
  //       ? {
  //           ...sorted,
  //           [line.image_id]: [...sorted[line.image_id], line],
  //         }
  //       : { ...sorted, [line.image_id]: [line] },
  //   {}
  // )

  // const imagesWithLines = Object.entries(linesSortedByImage).map(
  //   ([id, lines]) => ({ id, lines })
  // )
  console.log(lines);
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
