import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Select,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ClimbBreadcrumb, SectorBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import { useClimb, useAuthorizedFetcher } from '../utils/backend.js'

export default function AddBetaVideo() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)

  const history = useHistory()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [videoUrl, setVideoUrl] = useState('')
  const [timestamp, setTimestamp] = useState('')

  const addBetaVideo = () =>
    authorizedFetcher('/beta_videos', {
      method: 'POST',
      body: JSON.stringify({
        climb_id: climbId,
        video_url: videoUrl,
        timestamp: timestamp,
      }),
    })

  const voteBetaVideo = (videoId) =>
    authorizedFetcher(`/climbs/${videoId}/name_votes`, {
      method: 'POST',
      body: JSON.stringify({
        value: videoUrl,
      }),
    })

  const navigateToClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () =>
    addBetaVideo().then((video) =>
      Promise.all([voteBetaVideo(video.id)]).then(() =>
        navigateToClimb(video.id)
      )
    )

  if (authError || errorClimb) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load page.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && !isLoading) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">You need to login to add stuff and vote.</Text>
        </Center>
      </Container>
    )
  }

  if ((!authorizedFetcher && isLoading) || climbId === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <ClimbBreadcrumb climbId={climbId} extra={[{ text: 'Add beta video' }]} />
      <Heading>Add beta video</Heading>
      <FormControl isRequired>
        <FormLabel>YouTube-link</FormLabel>
        <Input
          placeholder="https://www.youtube.com/watch?"
          onChange={(event) => setVideoUrl(event.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Comment</FormLabel>
        <Input
          placeholder="Comment..."
          onChange={(event) => setTimestamp(event.target.value)}
        ></Input>
      </FormControl>
      <Button
        mt="10px"
        colorScheme="brand"
        color="white"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Container>
  )
}
