import { useAuth0 } from '@auth0/auth0-react'
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import Loader from '../components/loader.js'
import { PageFooter } from '../components/page-footer.js'
import { TickRocksLogo } from '../components/tick-rocks-logo.js'
import { useCurrentUser } from '../utils/backend'

export default function Landing() {
  return (
    <Box height={{ base: '80vh', md: '95vh' }} bgColor="gray.500">
      <Box position="absolute" width="100%" zIndex="initial">
        <Box display={{ base: 'none', md: 'block' }}>
          <video autoPlay muted loop width="100%" src="emil.mp4" />
        </Box>
        <Box display={{ base: 'block', md: 'none' }}>
          <video autoPlay muted loop width="100%" src="emilstand.mp4" />
        </Box>{' '}
      </Box>
      <Box
        position="relative"
        zIndex="docked"
        bgColor="blackAlpha.700"
        height="100%"
      >
        <Box>
          <Box position="absolute" bottom="0px" padding="10px" color="white">
            Big tick Move of the Month - September: Emil Abrahamsson, Total
            Eclipse, 8A+, Cul de Chen, Fontaniebleau, France.
          </Box>
          <Flex direction="column" align="center" justify="center">
            <Box mt={{ base: '2vh', md: '15vh' }}>
              <Flex
                direction="row"
                align="center"
                justify="center"
                margin="20px"
              >
                <TickRocksLogo
                  h={{ base: '40px', md: '70px' }}
                  w={{ base: '70px', md: '100px' }}
                />
                <Box color="white">
                  <Heading
                    fontSize={{ base: '4xl', md: '6xl' }}
                    lineHeight="1.0"
                  >
                    tick.rocks
                  </Heading>
                  <Text fontSize={{ base: 'md', md: '2xl' }}>
                    open-source climbing
                  </Text>
                </Box>
              </Flex>
              <SignedIn />
              <SimpleGrid columns="2" spacing="5px" mt="5px">
                <Button
                  as={RouterLink}
                  to="/search"
                  bgColor="blackAlpha.500"
                  color="white"
                >
                  Find a project
                </Button>
                <Button
                  as={RouterLink}
                  to="/map"
                  bgColor="blackAlpha.500"
                  color="white"
                >
                  Browse map
                </Button>
                <Button
                  as={RouterLink}
                  to="/crags"
                  bgColor="blackAlpha.500"
                  color="white"
                >
                  View all crags
                </Button>
                <Button
                  as={RouterLink}
                  to="/add-crag"
                  bgColor="blackAlpha.500"
                  color="white"
                >
                  Add crag
                </Button>
              </SimpleGrid>
            </Box>
          </Flex>
        </Box>
      </Box>

      <PageFooter position="relative" zIndex="docked" />
    </Box>
  )
}

function SignedIn() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()
  const { user } = useCurrentUser()
  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Container maxWidth="container.md" borderRadius="6px" color="white">
        <Center bgcolor="blackAlpha.500" marginTop="5px">
          <Text>
            You need to{' '}
            <Link
              onClick={() =>
                loginWithRedirect({
                  appState: {
                    returnTo: window.location.pathname,
                  },
                })
              }
              color="brand.300"
            >
              login
            </Link>{' '}
            to add stuff and vote.
          </Text>
        </Center>
      </Container>
    )
  } else {
    return (
      <Container
        bgColor="blackAlpha.500"
        borderRadius="6px"
        p="0px"
        color="white"
      >
        <HStack py="10px">
          <Box ml="16px" mr="8px">
            <Avatar name={user?.display_name} size="xs" />
          </Box>
          <Text>
            Welcome back {user?.display_name}
            ! <br />
            What would you like to do today?
          </Text>
        </HStack>
      </Container>
    )
  }
}
