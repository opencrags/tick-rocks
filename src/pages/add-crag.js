import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useAuthorizedFetcher } from '../utils/backend.js'

export default function AddCrag() {
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()
  const history = useHistory()
  const [cragName, setCragName] = useState('')

  const addCrag = () =>
    authorizedFetcher('/crags', {
      method: 'POST',
      body: JSON.stringify({}),
    })

  const voteCragName = (cragId) =>
    authorizedFetcher(`/crags/${cragId}/name_votes`, {
      method: 'POST',
      body: JSON.stringify({
        value: cragName,
        public: true,
      }),
    })

  const navigateToAddedCrag = (cragId) => history.replace(`/crags/${cragId}`)

  const handleSubmit = () =>
    addCrag().then((crag) =>
      voteCragName(crag.id).then((_) => navigateToAddedCrag(crag.id))
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
      <Heading>Add crag</Heading>
      <FormControl id="crag-name" isRequired>
        <FormLabel>Crag name</FormLabel>
        <Input
          placeholder="Crag name"
          value={cragName}
          onChange={(event) => setCragName(event.target.value)}
        />
      </FormControl>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}
