import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import {
  mostVoted,
  useAuthorizedFetcher,
  useClimb,
  useUserVote,
} from '../utils/backend.js'

export default function VoteClimbBroken() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { userVote, error: errorUserVote } = useUserVote(climb?.broken_votes)
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [climbBroken, setClimbBroken] = useState(true)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (climbBroken === null && userVote) {
      setClimbBroken(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [climbBroken, userVote])

  const voteClimbBroken = (climbId) => {
    const body = JSON.stringify({
      value: climbBroken,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(`/climbs/${climbId}/broken_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/climbs/${climbId}/broken_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () =>
    voteClimbBroken(climbId).then(() => navigateToClimb(climbId))

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
    <Box px="10px">
      {' '}
      Votes for {mostVoted(climb.name_votes)} as broken
      <Votes
        votes={climb.broken_votes}
        countedVoteItem={(countedVote) => (
          <Text>
            {countedVote.value} ({countedVote.count} votes)
          </Text>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setClimbBroken(false)
          } else {
            setClimbBroken(countedVote.value)
          }
        }}
        value={userVote?.value || null}
      />
      <FormControl display="none">
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
      <Button onClick={handleSubmit}>Vote</Button>
    </Box>
  )
}
