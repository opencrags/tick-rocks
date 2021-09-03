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
  Box,
  Flex,
} from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { useCurrentUser, useAuthorizedFetcher } from '../utils/backend.js'
import UserProfileBanner from '../components/user-profile-banner.js'
import { CragComponentBox } from '../components/crag-component-box.js'

import { useColorModeValue } from '@chakra-ui/color-mode'
export default function Settings() {
  const { user, userError, mutate } = useCurrentUser()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [displayName, setDisplayName] = useState(null)

  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.300', 'gray.900')

  useEffect(() => {
    if (displayName === null && user) {
      setDisplayName(user?.display_name)
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
      : authorizedFetcher(`/users/${user?.sub}`, {
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
    <Box bg={bg}>
      <UserProfileBanner>
        <CragComponentBox
          pl={{
            md: '15vw',
            base: '20px',
          }}
          pr={{
            md: '15vw',
            base: '20px',
          }}
        >
          <Flex w="100%" mt="20px">
            <Flex w="100%" maxW="500px" direction="column" padding="10px">
              <Heading size="md">Settings</Heading>
              <Flex w="100%">
                <FormControl>
                  <FormLabel>Display name</FormLabel>
                  <Input
                    placeholder="Display name"
                    value={displayName || ''}
                    onChange={(event) => setDisplayName(event.target.value)}
                  />
                </FormControl>
              </Flex>
              <Button marginTop="8px" onClick={updateDisplayName}>
                Save
              </Button>
            </Flex>
          </Flex>
        </CragComponentBox>
      </UserProfileBanner>
    </Box>
  )
}
