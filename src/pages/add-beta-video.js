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
  Box,
  Alert,
  AlertIcon,
  AspectRatio,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ClimbBreadcrumb, SectorBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import {
  useClimb,
  useAuthorizedFetcher,
  useBackendMatchMutate,
  useUserVote,
} from '../utils/backend.js'

export default function AddBetaVideo({ betaVideo }) {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const backendMatchMutate = useBackendMatchMutate()
  const history = useHistory()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [videoUrl, setVideoUrl] = useState('')
  const [editVideoUrl, setEditVideoUrl] = useState(betaVideo?.video_url)
  const [timestamp, setTimestamp] = useState('')
  const [editTimestamp, setEditTimestamp] = useState(betaVideo?.timestamp)
  const youtubeVideoId = youtube_parser(editVideoUrl ? editVideoUrl : videoUrl)
  const [attemptedWrongVideo, setAttemptedWrongVideo] = useState(false)
  const { userVote, error: errorUserVote } = useUserVote(betaVideo?.like_votes)

  const editBetaVideo = () =>
    authorizedFetcher(`/beta_videos/${betaVideo.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        climb_id: climbId,
        video_url: editVideoUrl,
        timestamp: editTimestamp,
      }),
    })

  const addBetaVideo = () =>
    authorizedFetcher('/beta_videos', {
      method: 'POST',
      body: JSON.stringify({
        climb_id: climbId,
        video_url: videoUrl,
        timestamp: timestamp,
      }),
    })

  const voteBetaVideo = (betaVideo) => {
    const body = JSON.stringify({
      value: true,
    })
    return userVote
      ? authorizedFetcher(`/climbs/${betaVideo}/like_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/climbs/${betaVideo}/like_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () => {
    if (youtubeVideoId === false) {
      setAttemptedWrongVideo(true)
    } else if (betaVideo != null) {
      setAttemptedWrongVideo(false)
      editBetaVideo().then(() => backendMatchMutate(/^.*\/.*$/))
    } else {
      setAttemptedWrongVideo(false)
      addBetaVideo().then((video) =>
        Promise.all([voteBetaVideo(video.id)]).then(() =>
          backendMatchMutate(/^.*\/.*$/)
        )
      )
    }
  }

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
      <ClimbBreadcrumb
        climbId={climbId}
        extra={[{ text: `${betaVideo ? 'Edit' : 'Add'} beta video` }]}
      />
      <Heading>{betaVideo ? 'Edit' : 'Add'} beta video</Heading>
      <FormControl isRequired>
        <FormLabel>YouTube-link</FormLabel>
        <Input
          placeholder="https://www.youtube.com/watch?abc123"
          defaultValue={betaVideo ? editVideoUrl : videoUrl}
          onChange={
            betaVideo
              ? (event) => setEditVideoUrl(event.target.value)
              : (event) => setVideoUrl(event.target.value)
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Comment</FormLabel>
        <Input
          placeholder="Comment..."
          defaultValue={betaVideo ? editTimestamp : timestamp}
          onChange={
            betaVideo
              ? (event) => setEditTimestamp(event.target.value)
              : (event) => setTimestamp(event.target.value)
          }
        ></Input>
      </FormControl>
      <FormLabel>Preview</FormLabel>
      {youtubeVideoId ? (
        <Box>
          <AspectRatio ratio={16 / 9} width="100%">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
              title="YouTube video player"
              height="100%"
              width="100%"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            ></iframe>
          </AspectRatio>
        </Box>
      ) : (
        <Alert
          colorScheme={attemptedWrongVideo ? 'red' : 'yellow'}
          status="warning"
          margin="0 2px 0px 2px"
          variant="left-accent"
        >
          <AlertIcon />
          Error with video-url, please try again.
        </Alert>
      )}

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

function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  var match = url.match(regExp)
  return match && match[7].length == 11 ? match[7] : false
}
