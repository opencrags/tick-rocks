import { config } from "./config";

const fetcher = (...args) => {
  return config().then((config) => {
    const resource = `${config.BACKEND}${args[0]}`;
    return (
      args.length === 1 ? fetch(resource) : fetch(resource, args[1])
    ).then((response) => {
      if (response.status >= 400) {
        throw response;
      }
      return response;
    });
  });
};

const authorizedFetcher = (token, ...args) => {
  const tokenHeader = {
    Authorization: `Bearer ${token}`,
  };
  return fetcher(
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

const autoAuthorizedFetcher = (getAccessTokenSilently, ...args) =>
  getAccessTokenSilently().then((token) => {
    const tokenHeader = {
      Authorization: `Bearer ${token}`,
    };
    return fetcher(
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
  });

export default {
  fetcher: fetcher,
  authorizedFetcher: authorizedFetcher,
  autoAuthorizedFetcher: autoAuthorizedFetcher,
};
export { fetcher, authorizedFetcher, autoAuthorizedFetcher };
