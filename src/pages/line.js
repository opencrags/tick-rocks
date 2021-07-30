import { Container, Center, Text, Code } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useLine, useImage } from '../utils/backend.js'
import LineImage from '../components/line-image.js'
import { ImageBreadcrumb } from '../components/breadcrumb.js'

export default function Line() {
  const { lineId } = useParams()
  const { line, error: errorLine } = useLine(lineId)
  const { image, error: errorImage } = useImage(line?.image_id)

  if (errorImage || errorLine) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load line.</Text>
        </Center>
      </Container>
    )
  }

  if (image === undefined || line === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <ImageBreadcrumb
        imageId={image.id}
        extra={[{ text: <Code>line-id: {line.id}</Code> }]}
      />
      <LineImage image={image} lines={line} />
    </Container>
  )
}
