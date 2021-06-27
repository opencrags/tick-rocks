import getConfig from "next/config";

const fetcher = (...args) => {
  const { publicRuntimeConfig } = getConfig();
  const resource = `${publicRuntimeConfig.BACKEND}${args[0]}`;
  return (args.length == 1 ? fetch(resource) : fetch(resource, args[1])).then(
    (response) => {
      if (response.status >= 400) {
        throw response;
      }
      return response;
    }
  );
};

const authorizedFetcher = (tokenHeader) => (...args) =>
  fetcher(
    args[0],
    args.length == 1
      ? { headers: tokenHeader }
      : {
          ...args[1],
          headers: {
            ...(args[1].headers ? args[1].headers : {}),
            ...tokenHeader,
          },
        }
  );

const autoAuthorizedFetcher = (...args) =>
  fetch("/api/auth/token")
    .then((response) => response.json())
    .then((tokenHeader) => authorizedFetcher(tokenHeader)(...args));

export default {
  fetcher: fetcher,
  authorizedFetcher: authorizedFetcher,
  autoAuthorizedFetcher: autoAuthorizedFetcher,
};
export { fetcher, authorizedFetcher, autoAuthorizedFetcher };
