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
import { useSWRConfig } from 'swr'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  useAuthorizedFetcher,
  useBackend,
  useCurrentUser,
  useBackendMatchMutate,
} from '../utils/backend.js'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'

export default function AddComment({ commentId }) {
  const boxBg = useColorModeValue('gray.200', 'gray.800')
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()
  const history = useHistory()
  const [comment, setComment] = useState('')
  const [attemptedEmptyComment, setAttemptedEmptyComment] = useState(false)
  const { user } = useCurrentUser()
  const [expand, setExpand] = useBoolean()
  const relatedIds = useParams()
  const relatedType = Object.keys(relatedIds).at(-1).replace('Id', '')
  const backendMatchMutate = useBackendMatchMutate()

  const addComment = () =>
    authorizedFetcher('/comments', {
      method: 'POST',
      body: JSON.stringify({
        comment: comment,
        related_id: Object.values(relatedIds).at(-1),
        related_type: relatedType,
        all_related_ids: Object.values(relatedIds),
        created: Date(),
        last_edited: Date(),
        last_activity: Date(),
      }),
    })

  const addReply = () =>
    authorizedFetcher(`/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({
        reply: comment,
        comment_id: commentId,
      }),
    })

  const handleSubmit = () => {
    if (comment === '') {
      setAttemptedEmptyComment(true)
    }
    if (commentId != null) {
      setAttemptedEmptyComment(false)
      addReply().then(() => backendMatchMutate(/^.*\/comments.*$/))
    } else {
      setAttemptedEmptyComment(false)
      addComment().then(() => backendMatchMutate(/^.*\/comments.*$/))
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
          <InputGroup bg={boxBg} borderRadius="15px" m="4px">
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
