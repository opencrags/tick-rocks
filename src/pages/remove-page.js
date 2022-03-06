import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react'
import Loader from '../components/loader.js'
import {
  useAuthorizedFetcher,
  useBackendMatchMutate,
} from '../utils/backend.js'

export default function RemovePage({ item, itemType, itemPath }) {
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()
  const backendMatchMutate = useBackendMatchMutate()

  const handleRemove = () => {
    removeItem().then(() => backendMatchMutate(/^.*\/.*$/))
  }

  const removeItem = () =>
    authorizedFetcher(`/${itemPath}/${item.id}`, {
      method: 'DELETE',
    })

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
          <Text margin="20px">Not signed in.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && isLoading) {
    return <Loader />
  }
  return (
    <Box px="20px">
      <Heading size="md">Remove {itemType}</Heading>
      <Text> Are you sure? You can't undo this action afterwards. </Text>
      <HStack justify="flex-end" mt="10px">
        <Button>Cancel</Button>
        <Button colorScheme="red" onClick={handleRemove}>
          Remove
        </Button>
      </HStack>
    </Box>
  )
}
