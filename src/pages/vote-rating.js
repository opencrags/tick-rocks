import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import {
  useAuthorizedFetcher,
  useClimb,
  useUserVote,
} from '../utils/backend.js'

export default function VoteRating() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb, mutate } = useClimb(climbId)
  const { userVote, error: errorUserVote } = useUserVote(climb?.rating_votes)
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [rating, setRating] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (rating === null && userVote) {
      setRating(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [rating, userVote])

  const voteRating = () => {
    const body = JSON.stringify({
      value: rating,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(`/climbs/${climbId}/rating_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/climbs/${climbId}/rating_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToClimb = () =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () => voteRating().then(mutate).then(navigateToClimb)

  if (authError || errorClimb || errorUserVote) {
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
          <Text margin="20px">You need to login to vote.</Text>
        </Center>
      </Container>
    )
  }

  if (!climb || userVote === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <ClimbBreadcrumb
        climbId={climbId}
        extra={[{ text: 'Vote for rating' }]}
      />
      <Heading>Vote for rating</Heading>
      <Votes
        votes={climb.rating_votes}
        countedVoteItem={(countedVote) => (
          <Text>
            {countedVote.value} stars ({countedVote.count} votes)
          </Text>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setRating('')
          } else {
            setRating(countedVote.value)
          }
        }}
        value={userVote?.value || null}
      />
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Rating</FormLabel>
        <Flex>
          <Box>
            <Text width="100px">{rating === null ? 0 : rating} / 5 stars</Text>
          </Box>
          <Box width="100%">
            <Slider
              min={0}
              max={5}
              step={1}
              value={rating === null ? '' : rating}
              onChange={setRating}
            >
              <SliderTrack>
                <Box position="relative" right={10} />
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
          </Box>
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel>Anonymous</FormLabel>
        <Checkbox
          isChecked={!publicVote}
          onChange={() => {
            setPublicVote(!publicVote)
          }}
        />
        <Text fontSize="sm">
          You can vote anonymously if you want but your vote will have a
          slightly lower value than if you openly support it.
        </Text>
      </FormControl>

      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}
