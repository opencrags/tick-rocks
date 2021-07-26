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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useAuth0 } from '@auth0/auth0-react'
import {
  useCrag,
  useSector,
  useClimb,
  useAuthorizedFetcher,
  countVotes,
} from '../utils/backend.js'

export default function VoteClimbName() {
  const { cragId, sectorId, climbId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const { climb, error: errorClimb } = useClimb(climbId)
  const { user } = useAuth0()
  const { authorizedFetcher, isLoading, error: authError } = useAuthorizedFetcher()
  const history = useHistory()
  const [climbName, setClimbName] = useState('')
  const [publicVote, setPublicVote] = useState(true)

  const userVote = useCallback(() => {
    const userVotes = climb.name_votes.filter(
      (name_vote) => name_vote.user_id === user.sub
    )
    if (userVotes.length === 1) {
      return userVotes[0]
    } else {
      return null
    }
  }, [climb?.name_votes, user?.sub])

  useEffect(() => {
    if (climb !== undefined && user && climbName === '' && userVote()) {
      const userVote_ = userVote()
      setClimbName(userVote_.value)
      setPublicVote(userVote_.public)
    }
  }, [climb, user, climbName, userVote])

  const voteClimbName = (climbId) =>
    userVote()
      ? authorizedFetcher(`/climbs/${climbId}/name_votes/${userVote().id}`, {
          method: 'PUT',
          body: JSON.stringify({
            value: climbName,
            public: publicVote,
          }),
        })
      : authorizedFetcher(`/climbs/${climbId}/name_votes`, {
          method: 'POST',
          body: JSON.stringify({
            value: climbName,
            public: publicVote,
          }),
        })

  const navigateToClimb = (climbId) =>
    history.replace(`/crags/${cragId}/climbs/${climbId}`)

  const handleSubmit = () =>
    voteClimbName(climbId).then((_) => navigateToClimb(climbId))

  if (authError || errorCrag || errorSector || errorClimb) {
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

  if (!climb) {
    return <Loader />
  }

  const countedVotes = countVotes(climb.name_votes)
  const maxVoteCount = Math.max(Object.values(countedVotes))

  return (
    <Container maxWidth="container.md">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/crags/${cragId}`}>
            {crag.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}`}
          >
            {sector.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`}
          >
            {climb.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Text>Vote for climb name</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading>Vote for climb name</Heading>
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
        <FormLabel>Climb name</FormLabel>
        <Input
          placeholder="Climb name"
          value={climbName}
          onChange={(event) => setClimbName(event.target.value)}
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
