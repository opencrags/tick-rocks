import {
  useCragPhoto,
  mostVoted,
  useUser,
  useCrag,
  useCurrentUser,
  authorizedFetcher,
} from '../utils/backend'
import {
  Box,
  Text,
  Image,
  Flex,
  Heading,
  LinkBox,
  Center,
  Button,
  Badge,
} from '@chakra-ui/react'
import React from 'react'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { CragBanner, CragBannerMenu } from '../components/crag-banner'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'

import { Link as RouterLink, useParams } from 'react-router-dom'
import { PageFooter } from '../components/page-footer'
export default function DateBadge(date) {
  console.log(date)
  const newDate = addDays(date, 8).toLocaleString()
  const today = new Date().toLocaleString()
  const milliseconds = today.getTime()

  console.log(milliseconds)
  console.log(test)
  console.log(newDate)
  console.log(today)

  // today === undefined ||
  const boxBg = useColorModeValue('gray.300', 'gray.600')
  if (date === undefined) {
    return ''
  }

  if (today > newDate)
    return (
      <Box pb="10px">
        <Badge colorScheme="green">New</Badge>
      </Box>
    )
}

function addDays(date, days) {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
