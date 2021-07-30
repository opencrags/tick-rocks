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
import { SectorBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import {
  useSector,
  useAuthorizedFetcher,
  useUserVote,
} from '../utils/backend.js'

export default function VoteSectorName() {
  const { cragId, sectorId } = useParams()
  const { sector, error: errorSector } = useSector(sectorId)
  const { userVote, error: errorUserVote } = useUserVote(sector?.name_votes)
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [sectorName, setSectorName] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (sectorName === null && userVote) {
      setSectorName(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [sectorName, userVote])

  const voteSectorName = (sectorId) => {
    const body = JSON.stringify({
      value: sectorName,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(`/sectors/${sectorId}/name_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/sectors/${sectorId}/name_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToSector = (sectorId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}`)

  const handleSubmit = () =>
    voteSectorName(sectorId).then(() => navigateToSector(sectorId))

  if (authError || errorSector || errorUserVote) {
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

  if (!sector || userVote === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <SectorBreadcrumb
        sectorId={sectorId}
        extra={[{ text: 'Vote for sector name' }]}
      />
      <Heading>Vote for sector name</Heading>
      <Votes
        votes={sector.name_votes}
        countedVoteItem={(countedVote) => (
          <Text>
            {countedVote.value} ({countedVote.count} votes)
          </Text>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setSectorName('')
          } else {
            setSectorName(countedVote.value)
          }
        }}
        value={userVote?.value || null}
      />
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Sector name</FormLabel>
        <Input
          placeholder="Sector name"
          value={sectorName || ''}
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
