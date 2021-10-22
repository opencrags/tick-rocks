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
import { PhotoGrid } from '../components/photo-grid.js'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useUser } from '../utils/backend.js'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { useCragPhotos } from '../utils/backend.js'
import { PageFooter } from '../components/page-footer.js'
import UserProfileBanner from '../components/user-profile-banner.js'
import Feed from '../components/feed.js'
import { CragComponentBox } from '../components/crag-component-box.js'
export default function UserPhotos() {
  const bannerColor = useColorModeValue('gray.300', 'gray.800')
  const { userId } = useParams()
  const { user, error: erroruser } = useUser(userId)
  const { cragPhotos, error: errorphotos } = useCragPhotos({ user_id: userId })

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
            <PhotoGrid cragPhotos={cragPhotos} error={errorphotos} />
          </Box>
        </CragComponentBox>
        <PageFooter />
      </Box>
    </>
  )
}
