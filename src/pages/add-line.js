import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ImageBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import TopoPlotter from '../components/topo-plotter.js'
import {
  mostVoted,
  useAuthorizedFetcher,
  useClimbs,
  useImage,
  useLines,
} from '../utils/backend.js'

export default function AddLine() {
  const { cragId, sectorId, imageId } = useParams()
  const history = useHistory()
  const { image, error: errorImage } = useImage(imageId)
  const { climbs, error: errorClimbs } = useClimbs({ sector_id: sectorId }, 100)
  const { authorizedFetcher, authError } = useAuthorizedFetcher()
  const [climbId, setClimbId] = useState('')
  const [linePath, setLinePath] = useState([])
  const { lines, error: errorLines } = useLines(
    imageId ? { image_id: imageId } : null
  )

  if (errorImage || errorClimbs || errorLines) {
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

  if (authError) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher || climbs === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <ImageBreadcrumb imageId={imageId} extra={[{ text: 'Add line' }]} />
      <Heading>Add line</Heading>
      <FormControl isRequired>
        <FormLabel>Climb</FormLabel>
        <Select
          placeholder="Select climb"
          onChange={(event) => setClimbId(event.target.value)}
        >
          {climbs.map((climb) => (
            <option key={climb.id} value={climb.id}>
              {mostVoted(climb.name_votes)}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Line path</FormLabel>
        <Button
          onClick={() => {
            setLinePath([])
          }}
        >
          Clear points
        </Button>
        <TopoPlotter
          image={image}
          lines={lines}
          linePath={linePath}
          setLinePath={setLinePath}
        />
      </FormControl>

      <Button
        onClick={handleSubmit}
        disabled={linePath.length >= 2 ? false : true}
      >
        Submit
      </Button>
    </Container>
  )
}
