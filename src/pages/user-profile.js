import {
  Container,
  Center,
  Heading,
  Link,
  LinkBox,
  Text,
  UnorderedList,
  ListItem,
  Box,
  HStack,
  Image,
  Flex,
  VStack,
  Avatar,
  Spacer,
} from '@chakra-ui/react'
import { CragPhotoGrid } from '../components/crag-photo-grid.js'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useUser } from '../utils/backend.js'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { useCragPhotos } from '../utils/backend.js'
import { PageFooter } from '../components/page-footer.js'
import UserProfileBanner from '../components/user-profile-banner.js'
export default function UserProfile() {
  const bannerColor = useColorModeValue('gray.300', 'gray.800')
  const { userId } = useParams()
  const { user, error: erroruser } = useUser(userId)
  const { cragPhotos, error } = useCragPhotos({ userId })
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
        <UserProfileBanner>
          {' '}
          <CragPhotoGrid userId={userId} />
        </UserProfileBanner>
      </Box>
    </>
  )
}
