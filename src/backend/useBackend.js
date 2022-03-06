import { useAuth0 } from '@auth0/auth0-react'
import { useAuthorizedFetcher } from './useAuthorizedFetcher.js'
import useSWR from 'swr'
import { useSWRConfig } from 'swr'
import { stringify } from 'query-string'

const camelToUnderscore = (key) => {
  var result = key.replace(/([A-Z])/g, ' $1')
  return result.split(' ').join('_').toLowerCase()
}

const camelToUnderscoreObject = (object) =>
  Object.keys(object).reduce(
    (newObject, key) =>
      Object.assign(newObject, { [camelToUnderscore(key)]: object[key] }),
    {}
  )

const removeUndefined = (object) =>
  Object.keys(object).reduce(
    (newObject, key) =>
      object[key] === undefined || object[key] === ''
        ? newObject
        : Object.assign(newObject, { [key]: object[key] }),
    {}
  )

const queryString = (query) => {
  return stringify(camelToUnderscoreObject(removeUndefined(query)))
}

export const useBackend = (endpoint, kwargs = {}) => {
  const query = kwargs?.query
  const options = kwargs?.options
  const { mutate } = useSWRConfig()
  const { user } = useAuth0()
  const authorizedFetcher = useAuthorizedFetcher()

  const uri =
    Object.keys(query ?? {}).length === 0
      ? endpoint
      : `${endpoint}?${queryString(query)}`

  console.log('user', user)
  const key = [uri, user.subject]

  const backend = useSWR(
    authorizedFetcher && uri ? key : null,
    (_) => authorizedFetcher(uri, options),
    options
  )

  // Local bound mutate is mutating new object if the key changes
  // https://github.com/vercel/swr/issues/1732
  const replaceLocalMutate = (data, shouldRevalidate) => {
    // options?.onMutate?.(data);
    const promise = options?.onMutate?.(data)
    return Promise.all([
      mutate(key, data, shouldRevalidate),
      ...(promise ? [promise] : []),
    ])
  }

  return {
    ...backend,
    mutate: replaceLocalMutate,
    isLoading: backend.data === undefined && backend.error === undefined,
    key,
  }
}
