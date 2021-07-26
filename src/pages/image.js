import {
  Container,
  Center,
  Link,
  Text,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Code,
} from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  useCrag,
  useSector,
  useImage,
  useLines,
  mostVoted,
} from '../utils/backend.js'
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
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/crags/${cragId}`}>
            {mostVoted(crag.name_votes)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}`}
          >
            {mostVoted(sector.name_votes)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Code>image-id: {image.id}</Code>
        </BreadcrumbItem>
      </Breadcrumb>
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/images/${imageId}/add-line`}
      >
        <Button>Add line</Button>
      </Link>
      <LineImage image={image} lines={lines} />
    </Container>
  )
}
