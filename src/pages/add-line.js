import {
  Container,
  Center,
  Heading,
  Select,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  useAuthorizedFetcher,
  useClimbs,
  useImage,
  useLines,
} from '../utils/backend.js'
import LineDrawerModal from '../components/line-drawer-modal.js'
import LineImage from '../components/line-image.js'
import { drawBeizerSplines } from '../utils/splines.js'

export default function AddLine() {
  const { cragId, sectorId, imageId } = useParams()
  const history = useHistory()
  const { authorizedFetcher, error } = useAuthorizedFetcher()
  const { climbs, error: errorClimbs } = useClimbs({ sector_id: sectorId }, 100)
  const [climbId, setClimbId] = useState('')
  const [linePath, setLinePath] = useState(null)
  const { lines, error: errorLines } = useLines(
    imageId ? { image_id: imageId } : null
  )
  const { onClose, onOpen, isOpen } = useDisclosure()

  const drawPlottedLine = useCallback(
    (ctx) => {
      ctx.fillStyle = '#ECC94B'
      linePath.forEach((point) => {
        const { x, y } = {
          x: point.x * ctx.canvas.width,
          y: point.y * ctx.canvas.height,
        }
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI, false)
        ctx.fill()
      })

      drawBeizerSplines(ctx, linePath, 0.5, '#ECC94B', 3)
    },
    [linePath]
  )

  const { image, error: errorImage } = useImage(imageId)
  if (errorImage || errorLines) {
    return (
      <Container maxW="container.md">
        <Center>
          <Text margin="20px">Failed to load image.</Text>
        </Center>
      </Container>
    )
  }

  const addLine = () =>
    authorizedFetcher('/lines', {
      method: 'POST',
      body: JSON.stringify({
        sector_id: sectorId,
        image_id: imageId,
        climb_id: climbId,
      }),
    })

  const voteLinePath = (lineId) =>
    authorizedFetcher(`/lines/${lineId}/line_path_votes`, {
      method: 'POST',
      body: JSON.stringify({
        value: linePath,
        public: true,
      }),
    })

  const navigateToAddedLine = (lineId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/lines/${lineId}`)

  const handleSubmit = () =>
    addLine().then((line) =>
      voteLinePath(line.id).then(() => navigateToAddedLine(line.id))
    )

  if (error) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher || !climbs) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <Heading>Add line</Heading>
      <FormControl isRequired>
        <FormLabel>Climb</FormLabel>
        <Select
          placeholder="Select climb"
          onChange={(event) => setClimbId(event.target.value)}
        >
          {climbs.map((climb) => (
            <option key={climb.id} value={climb.id}>
              {climb.name_votes[0].value}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Line path</FormLabel>
        {linePath ? (
          <>
            <LineImage image={image} lines={lines} draw={drawPlottedLine} />
            <Button onClick={onOpen}>Modify Line</Button>
          </>
        ) : (
          <>
            <Text>No line has been plotted, </Text>
            <Button onClick={onOpen}>Plot line</Button>
          </>
        )}
      </FormControl>

      <Button onClick={handleSubmit} disabled={linePath ? false : true}>
        Submit
      </Button>

      <LineDrawerModal
        onClose={onClose}
        isOpen={isOpen}
        image={image}
        setLinePath={setLinePath}
        lines={lines}
      />
    </Container>
  )
}