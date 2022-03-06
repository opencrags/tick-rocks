import {
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CragBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import { useAuthorizedFetcher, useCrag, useUserVote } from '../utils/backend.js'

export default function VoteAccessInformation() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { userVote, error: errorUserVote } = useUserVote(
    crag?.access_information_votes
  )
  const {
    authorizedFetcher,
    isLoading,
    error: errorAuth,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [accessInfornation, setAccessInformation] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (accessInfornation === null && userVote) {
      setAccessInformation(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [accessInfornation, userVote])

  const voteAccessInformation = () => {
    const body = JSON.stringify({
      value: accessInfornation,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(
          `/crags/${cragId}/access_information_votes/${userVote.id}`,
          {
            method: 'PUT',
            body: body,
          }
        )
      : authorizedFetcher(`/crags/${cragId}/access_information_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToCrag = () => history.replace(`/crags/${cragId}`)

  const handleSubmit = () => voteAccessInformation().then(navigateToCrag)

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
        extra={[{ text: 'Vote for access information' }]}
      />
      <Heading>Vote for access information</Heading>
      <Votes
        votes={crag.access_information_votes}
        countedVoteItem={(countedVote) => (
          <Text>
            {countedVote.value} ({countedVote.count} votes)
          </Text>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setAccessInformation('')
          } else {
            setAccessInformation(countedVote.value)
          }
        }}
        value={userVote?.value || null}
      />
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Access information</FormLabel>
        <Textarea
          value={accessInfornation || ''}
          onChange={(event) => setAccessInformation(event.target.value)}
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
