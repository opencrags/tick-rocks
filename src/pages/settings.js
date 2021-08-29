import { useState, useEffect } from 'react'
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
import Loader from '../components/loader.js'
import { useCurrentUser, useAuthorizedFetcher } from '../utils/backend.js'

export default function Settings() {
  const { user, userError, mutate } = useCurrentUser()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [displayName, setDisplayName] = useState(null)

  useEffect(() => {
    if (displayName === null && user) {
      setDisplayName(user.display_name)
    }
  }, [displayName, user])

  const updateDisplayName = () => {
    user.display_name === null
      ? authorizedFetcher('/users', {
          method: 'POST',
          body: JSON.stringify({
            display_name: displayName,
          }),
        })
      : authorizedFetcher(`/users/${user.sub}`, {
          method: 'PUT',
          body: JSON.stringify({
            display_name: displayName,
          }),
        })
    mutate({ ...user, display_name: displayName })
  }

  if (userError || authError) {
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
          <Text margin="20px">
            You need to login before you can change your settings.
          </Text>
        </Center>
      </Container>
    )
  }

  if (!user || (!authorizedFetcher && isLoading)) {
    return <Loader />
  }

  return (
    <Container marginTop="20px" maxWidth="container.md">
      <Heading>Settings</Heading>
      <FormControl>
        <FormLabel>Display name</FormLabel>
        <Input
          placeholder="Display name"
          value={displayName || ''}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </FormControl>
      <Button marginTop="8px" onClick={updateDisplayName}>
        Save
      </Button>
    </Container>
  )
}
