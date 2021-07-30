import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useAuthorizedFetcher } from '../utils/backend.js'
import { CragBreadcrumb } from '../components/breadcrumb.js'

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
        <FormLabel>Sector name</FormLabel>
        <Input
          placeholder="Sector name"
          onChange={(event) => setSectorName(event.target.value)}
        />
      </FormControl>
      <FormControl id="longitude">
        <FormLabel>Latitude</FormLabel>
        <NumberInput precision={7}>
          <NumberInputField
            onChange={(event) => setLatitude(event.target.value)}
          />
        </NumberInput>
      </FormControl>
      <FormControl id="longitude">
        <FormLabel>Longitude</FormLabel>
        <NumberInput precision={7}>
          <NumberInputField
            onChange={(event) => setLongitude(event.target.value)}
          />
        </NumberInput>
      </FormControl>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}
