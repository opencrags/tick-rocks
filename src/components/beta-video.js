import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
} from '@chakra-ui/react'
import Linkify from 'react-linkify'
import { Link as RouterLink } from 'react-router-dom'
import AddBetaVideo from '../pages/add-beta-video'
import RemovePage from '../pages/remove-page'
import { useCurrentUser, useUser } from '../utils/backend'
import LikeVote from './like-vote'
import ModalDialog from './modal-dialog'
export default function BetaVideo({ betaVideo }) {
  const { user } = useUser(betaVideo.user_id)
  const youtubeVideoId = youtube_parser(betaVideo.video_url)

  return (
    <Skeleton
      borderBottom="1px"
      _last={{ borderBottom: '0px' }}
      isLoaded={user !== undefined}
    >
      <Box mt="7px" mb="7px" fontSize="xs">
        <Flex justify="space-between" align="flex-start">
          <Flex direction="column">
            <Flex align="flex-start">
              <Box minW="80px" maxW="80px">
                <ModalDialog
                  padding="0px"
                  size="4xl"
                  button={
                    <Image
                      cursor="pointer"
                      mt="5px"
                      src={`https://img.youtube.com/vi/${youtubeVideoId}/sddefault.jpg`}
                    />
                  }
                >
                  <Box h="80vh">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                      title="YouTube video player"
                      height="100%"
                      width="100%"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    ></iframe>
                  </Box>
                </ModalDialog>
              </Box>
              <Flex ml="10px" direction="column">
                <Heading size="xs" as={RouterLink} to={`/user/${user?.id}`}>
                  {user?.display_name || 'Unnamed user'}
                </Heading>
                <Linkify>{betaVideo.timestamp}</Linkify>
              </Flex>
            </Flex>
          </Flex>
          <Box>
            {user?.id === useCurrentUser().user?.id ? (
              <Box>
                <Menu>
                  <MenuButton
                    ml="5px"
                    as={IconButton}
                    size="sm"
                    icon={<ChevronDownIcon />}
                  ></MenuButton>
                  <MenuList fontSize="md">
                    <ModalDialog button={<MenuItem>Edit</MenuItem>}>
                      <AddBetaVideo betaVideo={betaVideo} />
                    </ModalDialog>
                    <ModalDialog button={<MenuItem>Remove</MenuItem>}>
                      <RemovePage
                        item={betaVideo}
                        itemType="beta video"
                        itemPath="beta_videos"
                      />
                    </ModalDialog>
                  </MenuList>
                </Menu>
                <Box>{betaVideo.like_votes.length} likes</Box>
              </Box>
            ) : (
              <Box>
                <LikeVote
                  item={betaVideo}
                  itemId={betaVideo.id}
                  voteUrl="like_votes"
                  votes={betaVideo.like_votes}
                  fetcher="beta_videos"
                />
              </Box>
            )}
          </Box>
        </Flex>
      </Box>
    </Skeleton>
  )
}

function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  var match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : false
}

export { BetaVideo, youtube_parser }
