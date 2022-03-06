import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import { useHistory } from 'react-router-dom'

const Auth0ProviderWithHistory = ({ children }) => {
  const history = useHistory()

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_ISSUER_BASE_URL}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin + '/api/auth/callback'}
      onRedirectCallback={onRedirectCallback}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      scope={process.env.REACT_APP_AUTH0_SCOPE}
    >
      {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderWithHistory
