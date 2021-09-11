import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Alert,
  AlertIcon,
  InputRightElement,
  Flex,
  Avatar,
  Box,
  InputGroup,
  Textarea,
  useBoolean,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useAuthorizedFetcher, useCurrentUser } from '../utils/backend.js'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'

export default function AddComment({}) {
  const boxBg = useColorModeValue('gray.200', 'gray.800')
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()
  const history = useHistory()
  const [comment, setComment] = useState('')
  const [attemptedEmptyComment, setAttemptedEmptyComment] = useState(false)
  const { user } = useCurrentUser()
  const relatedIds = useParams()
  const [expand, setExpand] = useBoolean()
  const addComment = () =>
    authorizedFetcher('/comments', {
      method: 'POST',
      body: JSON.stringify({
        comment: comment,
        related_ids: Object.values(relatedIds),
      }),
    })

  const handleSubmit = () => {
    if (comment === '') {
      setAttemptedEmptyComment(true)
    } else {
      setAttemptedEmptyComment(false)
      addComment()
    }
  }

  if (error) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && !isLoading) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">You need to login to add comments.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && isLoading) {
    return <Loader />
  }

  return (
    <Box>
      <FormControl id="comment" isRequired>
        <Flex align="center">
          <Avatar mr="5px" size="sm" name={user?.display_name}></Avatar>
          <InputGroup bg={boxBg} borderRadius="15px" m="5px">
            <Input
              borderRadius="15px"
              variant="filled"
              placeholder="New comment..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button size="sm" variant="ghost" onClick={handleSubmit}>
                Post
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
        {attemptedEmptyComment === true && (
          <Alert status="warning" margin="0 2px 0px 2px" variant="left-accent">
            <AlertIcon />
            Comment can't be empty
          </Alert>
        )}
      </FormControl>
    </Box>
  )
}
