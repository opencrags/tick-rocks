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
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useUser } from '../utils/backend.js'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { useCragPhotos } from '../utils/backend.js'
import { PageFooter } from '../components/page-footer.js'
import UserProfileBanner from '../components/user-profile-banner.js'
import Feed from '../components/feed.js'
import { CragComponentBox } from '../components/crag-component-box.js'
export default function FeedPage() {
  const bannerColor = useColorModeValue('gray.300', 'gray.800')

  return (
    <>
      <Box h="100%">
        <CragComponentBox pt="10px">
          <Feed filter="" />
        </CragComponentBox>
        <PageFooter />
      </Box>
    </>
  )
}
