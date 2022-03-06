import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CragBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import { useAuthorizedFetcher } from '../utils/backend.js'

export default function AddSector() {
  const { cragId } = useParams()
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()
  const history = useHistory()
  const [sectorName, setSectorName] = useState('')
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  const addSector = () =>
    authorizedFetcher('/sectors', {
      method: 'POST',
      body: JSON.stringify({ crag_id: cragId }),
    })

  const voteSectorName = (sectorId) =>
    authorizedFetcher(`/sectors/${sectorId}/name_votes`, {
      method: 'POST',
      body: JSON.stringify({
        value: sectorName,
        public: true,
      }),
    })

  const voteSectorCoordinates = (sectorId) =>
    latitude &&
    longitude &&
    authorizedFetcher(`/sectors/${sectorId}/coordinate_votes`, {
      method: 'POST',
      body: JSON.stringify({
        value: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        public: true,
      }),
    })

  const navigateToAddedSector = (sectorId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}`)

  const handleSubmit = () =>
    addSector().then((sector) =>
      Promise.all([
        voteSectorName(sector.id),
        voteSectorCoordinates(sector.id),
      ]).then((_) => navigateToAddedSector(sector.id))
    )

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
          <Text margin="20px">You need to login to add stuff and vote.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && isLoading) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <CragBreadcrumb cragId={cragId} extra={[{ text: 'Add sector' }]} />
      <Heading>Add sector</Heading>
      <FormControl id="sector-name" isRequired>
        <FormLabel margin="0px">Sector name</FormLabel>
        <Input
          variant="flushed"
          size="lg"
          placeholder="Sector name"
          onChange={(event) => setSectorName(event.target.value)}
        />
      </FormControl>
      <HStack>
        <FormControl id="longitude">
          <FormLabel margin="0px">Latitude</FormLabel>
          <NumberInput variant="flushed" precision={7}>
            <NumberInputField
              placeholder="13"
              onChange={(event) => setLatitude(event.target.value)}
            />
          </NumberInput>
        </FormControl>
        <FormControl id="longitude">
          <FormLabel margin="0px">Longitude</FormLabel>
          <NumberInput variant="flushed" precision={7}>
            <NumberInputField
              placeholder="37"
              onChange={(event) => setLongitude(event.target.value)}
            />
          </NumberInput>
        </FormControl>
      </HStack>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}
