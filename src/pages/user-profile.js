import { useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Center, Container, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { CragComponentBox } from '../components/crag-component-box.js'
import Feed from '../components/feed.js'
import Loader from '../components/loader.js'
import { PageFooter } from '../components/page-footer.js'
import UserProfileBanner from '../components/user-profile-banner.js'
import { useUser } from '../utils/backend.js'

export default function UserProfile() {
  const { userId } = useParams()
  const { user, error: erroruser } = useUser(userId)
  const bg = useColorModeValue('gray.50', 'gray.700')
  if (erroruser) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load user.</Text>
        </Center>
      </Container>
    )
  }

  if (user === undefined) {
    return <Loader />
  }

  return (
    <>
      <Box h="100%">
        <UserProfileBanner userId={userId}></UserProfileBanner>
        <CragComponentBox bg={bg}>
          <Box py="10px">
            <Feed />
          </Box>
        </CragComponentBox>
        <PageFooter />
      </Box>
    </>
  )
}
