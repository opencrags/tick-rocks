import {
  Container,
  Center,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Code,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  useCrag,
  useSector,
  useLine,
  useClimb,
  useImage,
  mostVoted,
} from '../utils/backend.js'
import LineImage from '../components/line-image.js'

export default function Line() {
  const { cragId, sectorId, lineId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const { line, error: errorLine } = useLine(lineId)
  const { climb, error: errorClimb } = useClimb(line ? line.climb_id : null)
  const { image, error: errorImage } = useImage(line ? line.image_id : null)

  if (errorCrag || errorSector || errorClimb || errorImage || errorLine) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load line.</Text>
        </Center>
      </Container>
    )
  }

  if (
    crag === undefined ||
    sector === undefined ||
    climb === undefined ||
    image === undefined ||
    line === undefined
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
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}`}
          >
            <Code>image-id: {image.id}</Code>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Code>line-id: {line.id}</Code>
        </BreadcrumbItem>
      </Breadcrumb>
      <LineImage image={image} lines={line} />
    </Container>
  )
}
