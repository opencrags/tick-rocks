import { Box, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAuthorizedFetcher, useUserVote } from '../utils/backend.js'

export default function LikeVote({ item, votes, voteUrl, itemId, fetcher }) {
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

  if (isLoading) {
    return null
  }

  if (errorUserVote || authError) {
    return null
  }

  return (
    <Box>
      <Button size="xs" onClick={handleSubmit}>
        {userVote ? `${userVote.value} likes` : 'Like'}
      </Button>
    </Box>
  )
}
