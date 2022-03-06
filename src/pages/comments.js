import { useColorModeValue } from '@chakra-ui/color-mode'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
  Wrap,
} from '@chakra-ui/react'
import React from 'react'
import ModalDialog from '../components/modal-dialog'
import AddComment from '../pages/add-comment'
import {
  useAuthorizedFetcher,
  useComments,
  useCurrentUser,
  useUser,
} from '../utils/backend'
import RemovePage from './remove-page'

export default function Comments({ relatedId, wrap }) {
  const { comments, error: errorComments } = useComments(relatedId)

  if (errorComments) {
    return 'Error loading comments'
  }

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
              <Box key={comment.id}>
                <Comment comment={comment} />
              </Box>
            ))
          )}
        </Wrap>
      ) : (
        <Flex flexDirection="column">
          {comments.length === 0 ? (
            <Box mb="5px"> There are no comments.</Box>
          ) : (
            comments.map((comment) => (
              <Box key={comment.id} mb="5px">
                <Comment comment={comment} />
              </Box>
            ))
          )}
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
  // const { crag } = useCrag(comment?.all_related_ids[0])
  // const { sector } = useSector(comment?.all_related_ids[1])
  // const { climb } = useClimb(comment?.all_related_ids[2])

  return (
    <Box padding="2px" maxW="750px">
      {/* <Box py="10px">
        {comment.related_type === 'crag' ? (
          <CragBreadcrumb cragId={crag?.id} />
        ) : (
          ''
        )}
        {comment.related_type === 'sector' ? (
          <SectorBreadcrumb sectorId={sector?.id} />
        ) : (
          ''
        )}
        {comment.related_type === 'climb' ? (
          <ClimbBreadcrumb climbId={climb?.id} />
        ) : (
          ''
        )}
      </Box> */}
      <Flex fontSize="sm">
        <Avatar
          size="sm"
          name={user?.display_name}
          mt="10px"
          mr="10px"
        ></Avatar>
        <Box>
          <Box minW="285px" px="14px" py="8px" borderRadius="15px" bg={boxBg}>
            <Flex>
              <Text fontWeight="bold">
                {user?.display_name || 'No display name'}
              </Text>
              <Spacer />
              {user?.id === useCurrentUser().user?.id ? (
                <Menu>
                  <MenuButton
                    ml="5px"
                    as={IconButton}
                    size="xs"
                    icon={<ChevronDownIcon />}
                  ></MenuButton>
                  <MenuList fontSize="md">
                    <ModalDialog
                      button={<MenuItem>Edit</MenuItem>}
                    ></ModalDialog>
                    <ModalDialog button={<MenuItem>Remove</MenuItem>}>
                      <RemovePage
                        item={comment}
                        itemType="comment"
                        itemPath="comments"
                      />
                    </ModalDialog>
                  </MenuList>
                </Menu>
              ) : (
                ''
              )}
            </Flex>
            <Text wordBreak="break-all">{comment.comment}</Text>
          </Box>
          <Flex ml="10px" mt="2px" align="center">
            <Text fontSize="xs" mr="5px">
              {new Date(comment.created).toISOString().slice(0, 10)}
              {comment.last_edited !== comment.created ? (
                <span>
                  {' (edited: '}
                  {new Date(comment.last_edited).toISOString().slice(0, 10)}
                  {') '}
                </span>
              ) : (
                ''
              )}
            </Text>
            {isAuthenticated ? (
              <Box>
                <Button size="xs" variant="ghost">
                  Like
                </Button>
                <Button size="xs" variant="ghost" onClick={onToggle}>
                  {isOpen ? 'Hide' : 'Reply'}
                </Button>
              </Box>
            ) : (
              ''
            )}
          </Flex>
          <Flex flexDirection="column">
            {comment.replies.length === 0
              ? ''
              : comment.replies.map((reply) => (
                  <Box key={reply.id} mb="5px">
                    <Reply reply={reply} />
                  </Box>
                ))}{' '}
          </Flex>{' '}
          <Collapse in={isOpen} animateOpacity>
            <AddComment commentId={comment.id} />
          </Collapse>
        </Box>
      </Flex>
    </Box>
  )
}

function Reply({ reply }) {
  const boxBg = useColorModeValue('gray.200', 'gray.800')
  const { isAuthenticated } = useAuthorizedFetcher()
  const { isOpen, onToggle } = useDisclosure()
  const { user } = useUser(reply?.user_id)

  return (
    <Box padding="5px" maxW="750px">
      <Flex>
        <Avatar
          size="sm"
          name={user?.display_name}
          mt="10px"
          mr="10px"
        ></Avatar>
        <Box>
          <Box minW="285px" px="14px" py="8px" borderRadius="15px" bg={boxBg}>
            <Flex>
              <Text fontWeight="bold">
                {user?.display_name || 'No display name'}
              </Text>
              <Spacer />
              {user?.id === useCurrentUser().user?.id ? (
                <Menu>
                  <MenuButton
                    ml="5px"
                    as={IconButton}
                    size="xs"
                    icon={<ChevronDownIcon />}
                  ></MenuButton>
                  <MenuList fontSize="md">
                    <ModalDialog
                      button={<MenuItem>Edit</MenuItem>}
                    ></ModalDialog>
                    <ModalDialog button={<MenuItem>Remove</MenuItem>}>
                      <RemovePage
                        item={reply}
                        itemType="reply"
                        itemPath="​/comments​/{item_id}​/replies​/{reply_id}"
                      />
                    </ModalDialog>
                  </MenuList>
                </Menu>
              ) : (
                ''
              )}
            </Flex>
            <Text wordBreak="break-all">{reply.reply}</Text>
          </Box>
          <Flex ml="10px" mt="2px" align="center">
            <Text fontSize="xs" mr="5px">
              {new Date(reply.created).toISOString().slice(0, 10)}
              {reply.last_edited !== reply.created ? (
                <span>
                  {' (edited: '}
                  {new Date(reply.last_edited).toISOString().slice(0, 10)}
                  {') '}
                </span>
              ) : (
                ''
              )}
            </Text>
            {isAuthenticated ? (
              <Box>
                <Button size="xs" variant="ghost">
                  Like
                </Button>
                <Button size="xs" variant="ghost" onClick={onToggle}>
                  {isOpen ? 'Hide' : 'Reply'}
                </Button>
              </Box>
            ) : (
              ''
            )}
          </Flex>

          <Collapse in={isOpen} animateOpacity>
            <AddComment commentId={reply.comment_id} />
          </Collapse>
        </Box>
      </Flex>
    </Box>
  )
}

export { Comments }
