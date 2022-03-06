import { useAuth0 } from '@auth0/auth0-react'

export const useUserVote = (votes) => {
  const auth0 = useAuth0()
  const isLoading = auth0.isLoading || !votes

  return {
    isLoading,
    data: votes?.filter((vote) => vote.user_id === user?.sub)?.[0],
    error: auth0.error,
  }
}
