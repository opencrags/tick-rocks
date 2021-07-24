import { useAuth0 } from '@auth0/auth0-react'
import { Container, Center, Link, Text } from '@chakra-ui/react'
import Loader from './loader.js'

export default function Landing() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Container maxWidth="container.md">
        <Center marginTop="20px">
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
              color="teal.500"
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
      <Container maxWidth="container.md">
        <Center marginTop="20px">
          <Text>You are logged in.</Text>
        </Center>
      </Container>
    )
  }
}
