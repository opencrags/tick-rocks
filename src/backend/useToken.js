import useSwr from 'swr'
import { useAuth0 } from '@auth0/auth0-react'

export const useToken = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const { data, error } = useSwr(
    isAuthenticated ? 'token' : null,
    getAccessTokenSilently
  )
  return { token: data, error }
}
