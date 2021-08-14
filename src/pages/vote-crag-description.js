import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CragBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import { useCrag, useAuthorizedFetcher, useUserVote } from '../utils/backend.js'

export default function VoteCragDescription() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { userVote, error: errorUserVote } = useUserVote(
    crag?.description_votes
  )
  const {
    authorizedFetcher,
    isLoading,
    error: errorAuth,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [cragDescription, setCragDescription] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (cragDescription === null && userVote) {
      setCragDescription(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [cragDescription, userVote])

  const voteCragDescription = () => {
    const body = JSON.stringify({
      value: cragDescription,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(`/crags/${cragId}/description_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/crags/${cragId}/description_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToCrag = () => history.replace(`/crags/${cragId}`)

  const handleSubmit = () => voteCragDescription().then(navigateToCrag)

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
        extra={[{ text: 'Vote for Description' }]}
      />
      <Heading>Vote for Description</Heading>
      <Votes
        votes={crag.description_votes}
        countedVoteItem={(countedVote) => (
          <Text>
            {countedVote.value} ({countedVote.count} votes)
          </Text>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setCragDescription('')
          } else {
            setCragDescription(countedVote.value)
          }
        }}
        value={userVote?.value || null}
      />
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={cragDescription || ''}
          onChange={(event) => setCragDescription(event.target.value)}
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
