import {
  Box,
  Heading,
  Flex,
  Avatar,
  Text,
  Tooltip,
  Spacer,
  Button,
  Stack,
  LinkBox,
  useDisclosure,
  Collapse,
  Wrap,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import AddComment from '../pages/add-comment'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import {
  mostVoted,
  useAuthorizedFetcher,
  useClimb,
  useComments,
  useCrag,
  useSector,
  useUser,
} from '../utils/backend'

export default function Comments({ relatedId, children, wrap }) {
  const { comments, error: errorComments } = useComments(relatedId)

  if (comments === undefined) {
    return ''
  }

  return (
    <Box>
      {wrap ? (
        <Wrap>
          {comments.length === 0 ? (
            <Box mb="5px"> There are no comments.</Box>
          ) : (
            comments.map((comment) => (
              <Box>
                <Comment key={comment.id} comment={comment} />
              </Box>
            ))
          )}{' '}
        </Wrap>
      ) : (
        <Flex flexDirection="column">
          {comments.length === 0 ? (
            <Box mb="5px"> There are no comments.</Box>
          ) : (
            comments.map((comment) => (
              <Box mb="5px">
                <Comment key={comment.id} comment={comment} />
              </Box>
            ))
          )}{' '}
        </Flex>
      )}

      <AddComment />
    </Box>
  )
}

function Comment({ comment }) {
  const boxBg = useColorModeValue('gray.200', 'gray.800')
  const { isAuthenticated } = useAuthorizedFetcher()
  const { isOpen, onToggle } = useDisclosure()
  const { user } = useUser(comment?.user_id)
  const { crag } = useCrag(comment?.related_ids[0])
  const { sector } = useSector(comment?.related_ids[1])
  const { climb } = useClimb(comment?.related_ids[2])

  return (
    <Box maxW="750px">
      <Box>
        {mostVoted(crag?.name_votes)} {mostVoted(sector?.name_votes)}{' '}
        {mostVoted(climb?.name_votes)}
      </Box>
      <Flex>
        <Avatar
          size="sm"
          name={user?.display_name}
          mt="10px"
          mr="10px"
        ></Avatar>
        <Box>
          <Box minW="285px" px="14px" py="8px" borderRadius="15px" bg={boxBg}>
            <Text fontWeight="bold">
              {user?.display_name || 'No display name'}{' '}
              {new Date(comment.created).toISOString().slice(0, 10)}
            </Text>
            <Text wordBreak="break-all">{comment.comment}</Text>
          </Box>
          {/* {isAuthenticated ? (
            <Flex>
              <Button size="xs" variant="ghost">
                Like
              </Button>
              <Button size="xs" variant="ghost" onClick={onToggle}>
                {isOpen ? 'Hide' : 'Reply'}
              </Button>
            </Flex>
          ) : (
            ''
          )}

          <Collapse in={isOpen} animateOpacity>
            <AddComment />
          </Collapse> */}
        </Box>
      </Flex>
    </Box>
  )
}

export { Comments }
