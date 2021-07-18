import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { useConfig } from "../utils/backend";

const Auth0ProviderWithHistory = ({ children }) => {
  const { config, isLoading, error } = useConfig();
  const history = useHistory();

  if (isLoading) {
    return "Loading config...";
  }
  if (error) {
    return "Failed to load config";
  }
  const domain = config.AUTH0_ISSUER_BASE_URL;
  const clientId = config.AUTH0_CLIENT_ID;
  const redirect = config.AUTH0_REDIRECT;
  const audience = config.AUTH0_AUDIENCE;
  const scope = config.AUTH0_SCOPE;

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={redirect}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
      scope={scope}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
