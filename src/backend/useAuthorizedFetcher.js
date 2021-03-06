import { useToken } from './useToken'

const checkResponseStatus = (response) => {
  if (response.status >= 400) {
    throw response
  }
  return response
}

export const useAuthorizedFetcher = () => {
  const { token } = useToken()

  if (token) {
    return (endpoint, requestOptions = {}) =>
      fetch(`${process.env.REACT_APP_BACKEND}${endpoint}`, {
        ...requestOptions,
        method: requestOptions?.method ? requestOptions.method : 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...requestOptions?.headers,
        },
        body: requestOptions?.body
          ? JSON.stringify(requestOptions.body)
          : undefined,
      })
        .then(checkResponseStatus)
        .then((response) => {
          if (response.headers.get('content-type') === 'application/json') {
            return response.json()
          } else {
            return response.blob()
          }
        })
  } else {
    return null
  }
}
