import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  UnorderedList,
  ListItem,
  Button,
  VStack,
  Box,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import LineImage from '../components/line-image.js'
import {
  useCrag,
  useSector,
  useClimb,
  useClimbs,
  useImages,
  useLines,
} from '../utils/backend.js'

export default function Sector() {
  const { cragId, sectorId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const { climbs, error: errorClimbs } = useClimbs({ sector_id: sectorId })
  const { lines, error: errorLines } = useLines({ sector_id: sectorId })
  const { images, error: errorImages } = useImages({ sector_id: sectorId })

  if (errorCrag || errorSector || errorClimbs || errorLines || errorImages) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load sector.</Text>
        </Center>
      </Container>
    )
  }

  if (
    crag === undefined ||
    sector === undefined ||
    climbs === undefined ||
    lines === undefined ||
    images === undefined
  ) {
    return <Loader />
  }

  const climbIdsWithLines = new Set(
    Object.values(lines).map((line) => line.climb_id)
  )

  return (
    <Container maxWidth="container.md">
      <Heading size="lg">
        <Link as={RouterLink} to={`/crags/${cragId}`}>
          Crag: {crag.name_votes[0].value}
        </Link>
        <EditButton to={`/crags/${cragId}/vote-name`} />
      </Heading>

      <Heading size="lg">
        Sector:{' '}
        {sector.name_votes.length >= 1
          ? sector.name_votes[0].value
          : 'No name votes'}
        <EditButton to={`/crags/${cragId}/sectors/${sectorId}/vote-name`} />
      </Heading>
      {sector.coordinate_votes.length >= 1 && (
        <Heading size="xs">
          Coordinates: {sector.coordinate_votes[0].value.coordinates[1]},{' '}
          {sector.coordinate_votes[0].value.coordinates[0]}
        </Heading>
      )}
      <Heading size="sm">Undrawn climbs</Heading>
      <UnorderedList>
        {climbs
          .filter(
            (climb) =>
              climb.name_votes.length >= 1 && !climbIdsWithLines.has(climb.id)
          )
          .map((climb) => (
            <ListItem key={climb.id}>
              <Link
                as={RouterLink}
                to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climb.id}`}
              >
                <Text>{climb.name_votes[0].value}</Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/add-climb`}
      >
        <Button>Add climb</Button>
      </Link>
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/add-image`}
      >
        <Button>Add image</Button>
      </Link>
      <VStack>
        {images &&
          images.map((image) => (
            <ImageWithLines key={image.id} crag={crag} sector={sector} image={image} />
          ))}
      </VStack>
    </Container>
  )
}

function ImageWithLines({ crag, sector, image }) {
  const { lines, error } = useLines({ image_id: image.id })

  if (error) {
    return (
      <Center>
        <Text margin="20px">Failed to load lines.</Text>
      </Center>
    )
  }

  if (lines === undefined) {
    return <Loader />
  }

  return (
    <Box padding="10px" border="1px" borderColor="gray.200" borderRadius="md">
      <LineImage image={image} lines={lines} />
      <UnorderedList>
        {lines.map((line) => (
          <ListItem key={line.id}>
            <Climb crag={crag} sector={sector} line={line} />
          </ListItem>
        ))}
      </UnorderedList>
      <Link
        as={RouterLink}
        to={`/crags/${crag.id}/sectors/${sector.id}/images/${image.id}/add-line`}
      >
        <Button>Add line</Button>
      </Link>      
    </Box>
  )
}

function Climb({ crag, sector, line }) {
  const { climb, error } = useClimb(line.climb_id)

  if (error) {
    return <Text margin="20px">Failed to load climb.</Text>
  }

  if (climb === undefined) {
    return <Loader />
  }

  return (
    <Link
      as={RouterLink}
      to={`/crags/${crag.id}/sectors/${sector.id}/climbs/${climb.id}`}
    >
      <Text>{climb.name_votes[0].value}</Text>
    </Link>
  )
}
