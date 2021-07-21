import React, { useState } from "react";
import useSwr from "swr";
import { useAuth0 } from "@auth0/auth0-react";

const config = () => fetch("/config.json").then((response) => response.json());

const useConfig = () => {
  const { data, error } = useSwr("/config.json", config);

  return {
    config: data,
    isLoading: !error && !data,
    error: error,
  };
};

const useToken = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { data, error } = useSwr(
    isAuthenticated ? "token" : null,
    getAccessTokenSilently
  );
  return { token: data, error };
};

const fetcher = (config, ...args) => {
  const resource = `${config.BACKEND}${args[0]}`;
  return (args.length === 1 ? fetch(resource) : fetch(resource, args[1])).then(
    (response) => {
      if (response.status >= 400) {
        throw response;
      }
      return response.json();
    }
  );
};

const authorizedFetcher = (token, config, ...args) => {
  const tokenHeader = {
    Authorization: `Bearer ${token}`,
  };
  return fetcher(
    config,
    args[0],
    args.length === 1
      ? { headers: tokenHeader }
      : {
          ...args[1],
          headers: {
            ...(args[1].headers ? args[1].headers : {}),
            ...tokenHeader,
          },
        }
  );
};

const autoAuthorizedFetcher = (getAccessTokenSilently, ...args) => {
  return Promise.all([getAccessTokenSilently(), config()]).then(
    ([token, config]) => authorizedFetcher(token, config, ...args)
  );
};

const useAuthorizedFetcher = () => {
  const { isAuthenticated, isLoading, error: errorAuth } = useAuth0();
  const { config, errorConfig } = useConfig();
  const { token, errorToken } = useToken();
  const [isFetching, setIsFetching] = useState(false);
  return {
    isLoading,
    isAuthenticated,
    authorizedFetcher:
      config && token
        ? (...args) => {
            setIsFetching(true);
            return authorizedFetcher(token, config, ...args).finally(() =>
              setIsFetching(false)
            );
          }
        : null,
    isFetching,
    error: errorConfig || errorToken || errorAuth,
  };
};

const useBackend = (key, ...args) => {
  const { token, errorToken } = useToken();
  const { config, errorConfig } = useConfig();
  return useSwr([key, token, JSON.stringify(args)], (key) =>
    token
      ? authorizedFetcher(token, config, key, ...args)
      : fetcher(config, key, ...args)
  );
};

const useAuthorizedBackend = (key, ...args) => {
  const { token, errorToken } = useToken();
  const { config, errorConfig } = useConfig();
  return useSwr(token && config ? key : null, (key) =>
    authorizedFetcher(token, config, key, ...args)
  );
};

export default {
  useToken,
  config,
  useConfig,
  fetcher,
  authorizedFetcher,
  autoAuthorizedFetcher,
  useAuthorizedFetcher,
  useBackend,
  useAuthorizedBackend,
};
export {
  useToken,
  config,
  useConfig,
  fetcher,
  authorizedFetcher,
  autoAuthorizedFetcher,
  useAuthorizedFetcher,
  useBackend,
  useAuthorizedBackend,
};
