import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Box,
  Progress,
  Checkbox,
} from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useAuth0 } from '@auth0/auth0-react'
import { useCrag, useAuthorizedFetcher, countVotes } from '../utils/backend.js'

export default function VoteCragName() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { user } = useAuth0()
  const { authorizedFetcher, isLoading, error: errorAuth } = useAuthorizedFetcher()
  const history = useHistory()
  const [cragName, setCragName] = useState('')
  const [publicVote, setPublicVote] = useState(true)

  const userVote = useCallback(() => {
    const userVotes = crag.name_votes.filter(
      (name_vote) => name_vote.user_id === user.sub
    )
    if (userVotes.length === 1) {
      return userVotes[0]
    } else {
      return null
    }
  }, [crag?.name_votes, user?.sub])

  useEffect(() => {
    if (crag !== undefined && user && cragName === '' && userVote()) {
      const userVote_ = userVote()
      setCragName(userVote_.value)
      setPublicVote(userVote_.public)
    }
  }, [crag, user, cragName, userVote])

  const voteCragName = (cragId) =>
    userVote()
      ? authorizedFetcher(`/crags/${cragId}/name_votes/${userVote().id}`, {
          method: 'PUT',
          body: JSON.stringify({
            value: cragName,
            public: publicVote,
          }),
        })
      : authorizedFetcher(`/crags/${cragId}/name_votes`, {
          method: 'POST',
          body: JSON.stringify({
            value: cragName,
            public: publicVote,
          }),
        })

  const navigateToCrag = (cragId) => history.replace(`/crags/${cragId}`)

  const handleSubmit = () =>
    voteCragName(cragId).then((_) => navigateToCrag(cragId))

  if (errorAuth || errorCrag) {
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

  if (!crag) {
    return <Loader />
  }

  const countedVotes = countVotes(crag.name_votes)
  const maxVoteCount = Math.max(Object.values(countedVotes))

  return (
    <Container maxWidth="container.md">
      <Heading>Vote for crag name</Heading>
      <Box
        border="1px"
        borderColor="gray.300"
        borderRadius="md"
        padding="10px"
        margin="20px"
      >
        <Heading size="sm">Votes</Heading>
        {countedVotes.map((vote) => (
          <Box key={vote.value}>
            <Text>
              {vote.value} ({vote.count} votes)
            </Text>
            <Progress value={vote.count / maxVoteCount} />
          </Box>
        ))}
      </Box>
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Crag name</FormLabel>
        <Input
          placeholder="Crag name"
          value={cragName}
          onChange={(event) => setCragName(event.target.value)}
        />
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
