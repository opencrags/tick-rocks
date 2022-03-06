import { useColorModeValue } from '@chakra-ui/color-mode'
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { CragComponentBox } from '../components/crag-component-box.js'
import Loader from '../components/loader.js'
import { PageFooter } from '../components/page-footer.js'
import UserProfileBanner from '../components/user-profile-banner.js'
import { useAuthorizedFetcher, useCurrentUser } from '../utils/backend.js'

export default function Settings() {
  const { user, userError, mutate } = useCurrentUser()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [displayName, setDisplayName] = useState(null)
  const bg = useColorModeValue('offwhite', 'gray.700')

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
      : authorizedFetcher(`/users/${user?.id}`, {
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
      <UserProfileBanner userId={user.id}></UserProfileBanner>
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
        <Flex w="100%" my="20px" direction="column">
          <Box maxW="700px">
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Profile Picture
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack>
                  <Avatar size="lg"></Avatar>
                  <Button>Upload</Button>
                </HStack>
              </GridItem>
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Display name
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input
                  placeholder="Display name"
                  value={displayName || ''}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </GridItem>{' '}
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Country
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input />
              </GridItem>{' '}
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Language
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input />
              </GridItem>{' '}
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Date of birth
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input />
              </GridItem>
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Climbing since
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input />
              </GridItem>{' '}
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Presentation
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Textarea />
              </GridItem>
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Height
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input />
              </GridItem>
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Weight
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input />
              </GridItem>
              <GridItem colSpan={1}>
                <FormLabel textAlign="right" w="200px">
                  Wingspan
                </FormLabel>
              </GridItem>
              <GridItem colSpan={2}>
                <Input />
              </GridItem>
            </Grid>
            <Button w="100%" marginTop="8px" onClick={updateDisplayName}>
              Save
            </Button>
          </Box>
        </Flex>
      </CragComponentBox>
      <PageFooter />
    </Box>
  )
}
