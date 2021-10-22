import { useState, useEffect } from 'react'
import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Box,
  Flex,
  SimpleGrid,
  HStack,
  VStack,
  Grid,
  GridItem,
  Avatar,
  Textarea,
  Image,
} from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { useCurrentUser, useAuthorizedFetcher } from '../utils/backend.js'
import UserProfileBanner from '../components/user-profile-banner.js'
import { CragComponentBox } from '../components/crag-component-box.js'
import { useColorModeValue } from '@chakra-ui/color-mode'
import BetaVideo from './beta-video.js'
export default function Feed(filter) {
  return (
    <Box>
      <FeedItemBox>
        <FeedItem itemType="content" />
      </FeedItemBox>
      <FeedItemBox>
        <FeedItem itemType="photo" />
      </FeedItemBox>
      <FeedItemBox>
        <FeedItem itemType="ascent" />
      </FeedItemBox>
      <FeedItemBox>
        <FeedItem itemType="betavideo" />
      </FeedItemBox>
    </Box>
  )
}

function FeedItemBox({ children }) {
  const bg = useColorModeValue('gray.200', 'gray.600')
  return (
    <Box my="10px" mx="5px" p="10px" boxShadow="md" bg={bg}>
      {children}
    </Box>
  )
}

function FeedItem({ itemId, itemType }) {
  if (itemType === 'content') {
    return (
      <VStack align="left">
        <HStack>
          <Avatar></Avatar>
          <Text>UserName added new content </Text>{' '}
        </HStack>{' '}
        <HStack>
          <Button size="xs">Like</Button>
          <Button size="xs">Comment</Button>
        </HStack>
      </VStack>
    )
  }
  if (itemType === 'ascent') {
    return (
      <VStack align="left">
        <HStack>
          <Avatar></Avatar>
          <Text>UserName just ticked! </Text>{' '}
        </HStack>
        <HStack>
          <Button size="xs">Like</Button>
          <Button size="xs">Call dab</Button>
          <Button size="xs">Comment</Button>
        </HStack>
      </VStack>
    )
  }
  if (itemType === 'photo') {
    return (
      <VStack align="left">
        <HStack>
          <Avatar></Avatar>
          <Text>UserName added new photo!</Text>{' '}
        </HStack>
        <Box>
          <Image
            w="200px"
            src="https://27crags.s3.amazonaws.com/photos/000/135/135029/size_xl-e7325c73b00d.jpg"
          ></Image>
        </Box>
        <HStack>
          <Button size="xs">Like</Button>
          <Button size="xs">Comment</Button>
        </HStack>
      </VStack>
    )
  }
  if (itemType === 'betavideo') {
    return (
      <VStack align="left">
        <HStack>
          <Avatar></Avatar>
          <Text>UserName added new beta video for ... </Text>{' '}
        </HStack>

        <Box></Box>
      </VStack>
    )
  } else return 's'
}
