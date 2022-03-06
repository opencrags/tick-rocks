import {
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CragBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import { useAuthorizedFetcher, useCrag, useUserVote } from '../utils/backend.js'

export default function VoteCragName() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { userVote, error: errorUserVote } = useUserVote(crag?.name_votes)
  const {
    authorizedFetcher,
    isLoading,
    error: errorAuth,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [cragName, setCragName] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (cragName === null && userVote) {
      setCragName(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [cragName, userVote])

  const voteCragName = (cragId) => {
    const body = JSON.stringify({
      value: cragName,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(`/crags/${cragId}/name_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/crags/${cragId}/name_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToCrag = (cragId) => history.replace(`/crags/${cragId}`)

  const handleSubmit = () =>
    voteCragName(cragId).then(() => navigateToCrag(cragId))

  if (errorAuth || errorCrag || errorUserVote) {
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

  if (!crag || userVote === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <CragBreadcrumb
        cragId={cragId}
        extra={[{ text: 'Vote for crag name' }]}
      />
      <Heading>Vote for crag name</Heading>
      <Votes
        votes={crag.name_votes}
        countedVoteItem={(countedVote) => (
          <Text>
            {countedVote.value} ({countedVote.count} votes)
          </Text>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setCragName('')
          } else {
            setCragName(countedVote.value)
          }
        }}
        value={userVote?.value || null}
      />
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Crag name</FormLabel>
        <Input
          placeholder="Crag name"
          value={cragName || ''}
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
