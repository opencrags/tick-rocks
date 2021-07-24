import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  Button,
} from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useCrag, useSector, useImage, useLines } from '../utils/backend.js'
import LineImage from '../components/line-image.js'

export default function RockImage() {
  const { cragId, sectorId, imageId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const { image, error: errorImage } = useImage(imageId)
  const { lines, error: errorLines } = useLines(
    imageId ? { image_id: imageId } : null
  )

  if (errorCrag || errorSector || errorImage || errorLines) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load image.</Text>
        </Center>
      </Container>
    )
  }

  if (
    crag === undefined ||
    sector === undefined ||
    image === undefined ||
    lines === undefined
  ) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="md">Crag: {crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="md">Sector: {sector.name_votes[0].value}</Heading>
      </Link>
      <LineImage image={image} lines={lines} />
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/images/${imageId}/add-line`}
      >
        <Button>Add line</Button>
      </Link>
    </Container>
  )
}
