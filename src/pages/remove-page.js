import {
  Container,
  Center,
  Heading,
  Text,
  Button,
  Box,
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  useAuthorizedFetcher,
  useBackend,
  useBackendMatchMutate,
  useCurrentUser,
} from '../utils/backend.js'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'

export default function RemovePage({ item, itemType, itemPath }) {
  const boxBg = useColorModeValue('gray.200', 'gray.800')
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()
  const history = useHistory()
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
