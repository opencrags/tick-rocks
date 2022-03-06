import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from './useUser'

export const useCurrentUser = () => {
  const { user: auth0User, error: auth0Error } = useAuth0()
  const user = useUser(auth0User?.sub)
  return {
    error: auth0Error || error,
    ...(user ?? {}),
  }
}
