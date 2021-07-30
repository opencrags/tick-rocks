import {
  Container,
  Center,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { SectorBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import {
  useSector,
  useAuthorizedFetcher,
  useUserVote,
} from '../utils/backend.js'

export default function VoteSectorCoordinates() {
  const { cragId, sectorId } = useParams()
  const { sector, error: errorSector } = useSector(sectorId)
  const { userVote, error: errorUserVote } = useUserVote(
    sector?.coordinate_votes
  )
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (latitude === null && longitude === null && userVote) {
      setLatitude(userVote.value.coordinates[1])
      setLongitude(userVote.value.coordinates[0])
      setPublicVote(userVote.public)
    }
  }, [latitude, longitude, userVote])

  const voteSectorCoordinates = (sectorId) => {
    const body = JSON.stringify({
      value: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(
          `/sectors/${sectorId}/coordinate_votes/${userVote.id}`,
          {
            method: 'PUT',
            body: body,
          }
        )
      : authorizedFetcher(`/sectors/${sectorId}/coordinate_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToSector = (sectorId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}`)

  const handleSubmit = () =>
    voteSectorCoordinates(sectorId).then(() => navigateToSector(sectorId))

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
        extra={[{ text: 'Vote for sector coordinates' }]}
      />
      <Heading>Vote for sector coordinates</Heading>
      <Votes
        votes={sector.coordinate_votes}
        countedVoteItem={(countedVote) => (
          <Text>
            {JSON.stringify(countedVote.value.coordinates)} ({countedVote.count}{' '}
            votes)
          </Text>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setLatitude('')
            setLongitude('')
          } else {
            setLatitude([countedVote.value.coordinates[1]])
            setLongitude([countedVote.value.coordinates[0]])
          }
        }}
        value={userVote?.value || null}
      />
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Latitude</FormLabel>
        <NumberInput value={latitude || ''} precision={7}>
          <NumberInputField
            onChange={(event) => setLatitude(event.target.value)}
          />
        </NumberInput>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Longitude</FormLabel>
        <NumberInput value={longitude || ''} precision={7}>
          <NumberInputField
            onChange={(event) => setLongitude(event.target.value)}
          />
        </NumberInput>
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
