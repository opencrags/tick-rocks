import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  Box,
  Flex,
  useColorModeValue,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from './loader.js'
import {
  useClimb,
  useAuthorizedFetcher,
  useUserVote,
  mostVoted,
} from '../utils/backend.js'

import { ClimbBreadcrumb } from './breadcrumb.js'
import Votes from './votes.js'
import {
  CragBanner,
  CragBannerMenu,
  CragBannerMenuButton,
} from './crag-banner.js'
export default function LikeVote({ item, votes, voteUrl, itemId, fetcher }) {
  console.log(item.id)
  const { userVote, error: errorUserVote } = useUserVote(item?.voteUrl)
  const [likeVotes, setLikeVotes] = useState(true)
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()

  useEffect(() => {
    if (likeVotes === null && userVote) {
      setLikeVotes(userVote.value)
    }
  }, [likeVotes, userVote])

  const likeVoteContent = (itemId) => {
    const body = JSON.stringify({
      value: likeVotes,
      public: true,
    })
    return userVote
      ? authorizedFetcher(`/${fetcher}/${itemId}/${voteUrl}/${votes.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/${fetcher}/${itemId}/${voteUrl}`, {
          method: 'POST',
          body: body,
        })
  }
  const handleSubmit = () => likeVoteContent(itemId)

  console.log(userVote)
  return (
    <Box>
      <Button size="xs" onClick={handleSubmit}>
        {userVote ? `${userVote.value} likes` : 'Like'}
      </Button>
    </Box>
  )
}
