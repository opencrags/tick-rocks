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
import {
  useSector,
  useAuthorizedFetcher,
  countVotes,
} from '../utils/backend.js'

export default function VoteSectorName() {
  const { cragId, sectorId } = useParams()
  const { sector, error: errorSector } = useSector(sectorId)
  const { user } = useAuth0()
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()
  const history = useHistory()
  const [sectorName, setSectorName] = useState('')
  const [publicVote, setPublicVote] = useState(true)

  const userVote = useCallback(() => {
    const userVotes = sector.name_votes.filter(
      (name_vote) => name_vote.user_id === user.sub
    )
    if (userVotes.length === 1) {
      return userVotes[0]
    } else {
      return null
    }
  }, [sector?.name_votes, user?.sub])

  useEffect(() => {
    if (sector !== undefined && user && sectorName === '' && userVote()) {
      const userVote_ = userVote()
      setSectorName(userVote_.value)
      setPublicVote(userVote_.public)
    }
  }, [sector, user, sectorName, userVote])

  const voteSectorName = (sectorId) =>
    userVote()
      ? authorizedFetcher(`/sectors/${sectorId}/name_votes/${userVote().id}`, {
          method: 'PUT',
          body: JSON.stringify({
            value: sectorName,
            public: publicVote,
          }),
        })
      : authorizedFetcher(`/sectors/${sectorId}/name_votes`, {
          method: 'POST',
          body: JSON.stringify({
            value: sectorName,
            public: publicVote,
          }),
        })

  const navigateToSector = (sectorId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}`)

  const handleSubmit = () =>
    voteSectorName(sectorId).then((_) => navigateToSector(sectorId))

  if (error) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
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

  if (!sector) {
    return <Loader />
  }

  const countedVotes = countVotes(sector.name_votes)
  const maxVoteCount = Math.max(Object.values(countedVotes))

  return (
    <Container maxWidth="container.md">
      <Heading>Vote for sector name</Heading>
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
        <FormLabel>Sector name</FormLabel>
        <Input
          placeholder="Sector name"
          value={sectorName}
          onChange={(event) => setSectorName(event.target.value)}
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
