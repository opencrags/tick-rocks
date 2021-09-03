import { useCragPhoto, mostVoted, useUser, useCrag } from '../utils/backend'
import {
  Box,
  Text,
  Image,
  Flex,
  Heading,
  LinkBox,
  Center,
} from '@chakra-ui/react'
import React from 'react'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { CragBanner, CragBannerMenu } from '../components/crag-banner'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'

import { Link as RouterLink, useParams } from 'react-router-dom'
import { PageFooter } from '../components/page-footer'
export default function CragPhotoPage({ cragPhotoId }) {
  const { cragId } = useParams()
  const { cragPhoto, error } = useCragPhoto(cragPhotoId)
  const { crag, error: errorCrag } = useCrag(cragId)
  const { user } = useUser(cragPhoto?.user_id)
  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.300', 'gray.600')

  if (cragPhoto === undefined || user === undefined) {
    return ''
  }

  if (error) {
    return <Text>Error fetching photo</Text>
  }
  return (
    <Box pb="10px">
      <Center>
        <Text>Uploaded by: {user.display_name}</Text>
      </Center>
      <Center>
        <Image maxH="100vh" src={cragPhoto.base64_image} />
      </Center>
    </Box>
  )
}
