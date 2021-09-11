import { useAuth0 } from '@auth0/auth0-react'
import {
  Container,
  Center,
  Text,
  Box,
  LinkBox,
  Flex,
  Heading,
  HStack,
  Input,
  Button,
  SimpleGrid,
  Link,
  Avatar,
  Wrap,
} from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { PageFooter } from '../components/page-footer.js'
import { ParallaxBanner } from 'react-scroll-parallax'
import { TickRocksLogo } from '../components/tick-rocks-logo.js'
import { useDisclosure } from '@chakra-ui/hooks'
import { SearchIcon } from '@chakra-ui/icons'

import { useCurrentUser, useQuickSearch, mostVoted } from '../utils/backend'
import { Link as RouterLink } from 'react-router-dom'

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
                ></TickRocksLogo>
                <Box color="white">
                  <Heading fontSize={{ base: '4xl', md: '6xl' }}>
                    tick.rocks
                  </Heading>
                  <Text fontSize={{ base: 'md', md: '2xl' }}>
                    open-source climbing
                  </Text>
                </Box>
              </Flex>

              <Flex
                padding="10px"
                w="100%"
                borderRadius="6px"
                backgroundColor="blackAlpha.500"
              >
                <SearchIcon color="gray.300" w={8} h={5} mr={5} />
                <Input
                  color="white"
                  variant="unstyled"
                  placeholder="Search crags, routes, climbers, etc."
                />
              </Flex>
              <SignedIn />
              <SimpleGrid columns="2" spacing="5px" mt="5px">
                <Button
                  as={RouterLink}
                  to="/search"
                  colorScheme="green"
                  bgColor="blackAlpha.500"
                  color="white"
                >
                  Find a project
                </Button>
                <Button
                  as={RouterLink}
                  to="/map"
                  colorScheme="green"
                  bgColor="blackAlpha.500"
                  color="white"
                >
                  Browse map
                </Button>
                <Button
                  as={RouterLink}
                  to="/crags"
                  colorScheme="green"
                  bgColor="blackAlpha.500"
                  color="white"
                >
                  View all crags
                </Button>
                <Button
                  as={RouterLink}
                  to="/add-crag"
                  colorScheme="green"
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

function LandingPageSlider({ imageUrl }) {
  return (
    <Box>
      <ParallaxBanner
        className="your-class"
        layers={[
          {
            image: imageUrl,
            amount: 0.7,
          },
        ]}
        style={{
          height: '50vh',
        }}
      >
        <h1>Banner Children</h1>
      </ParallaxBanner>
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
      <Container bgColor="blackAlpha.500" borderRadius="6px" color="white">
        <Center marginTop="5px">
          <HStack>
            <Avatar name={user?.display_name} size="xs" />
            <Text>
              Welcome back {user?.display_name}
              ! <br />
              What would you like to do today?
            </Text>
          </HStack>
        </Center>
      </Container>
    )
  }
}
