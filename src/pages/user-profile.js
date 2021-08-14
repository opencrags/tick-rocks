import {
  Container,
  Center,
  Heading,
  Link,
  LinkBox,
  Text,
  UnorderedList,
  ListItem,
  Button,
  Box,
  HStack,
  Image,
  Flex,
  AvatarGroup,
  Avatar,
  Wrap,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Spacer,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useUser, useSectors, mostVoted } from '../utils/backend.js'

export default function UserProfile() {
  const { userId } = useParams()
  const { user, error: erroruser } = useUser(userId)
  if (erroruser || errorSectors) {
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
      <Box></Box>
    </>
  )
}
