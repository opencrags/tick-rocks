import { Button, Center, Container, Link, Text } from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { ImageBreadcrumb } from '../components/breadcrumb.js'
import LineImage from '../components/line-image.js'
import Loader from '../components/loader.js'
import { useImage, useLines } from '../utils/backend.js'

export default function RockImage() {
  const { cragId, sectorId, imageId } = useParams()
  const { image, error: errorImage } = useImage(imageId)
  const { lines, error: errorLines } = useLines(
    imageId ? { image_id: imageId } : null
  )

  if (errorImage || errorLines) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load image.</Text>
        </Center>
      </Container>
    )
  }

  if (image === undefined || lines === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <ImageBreadcrumb imageId={imageId} />
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
