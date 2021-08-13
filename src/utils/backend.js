import { useState } from 'react'
import useSwr from 'swr'
import { useAuth0 } from '@auth0/auth0-react'

const useToken = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const { data, error } = useSwr(
    isAuthenticated ? 'token' : null,
    getAccessTokenSilently
  )
  return { token: data, error }
}

const fetcher = (...args) => {
  const resource = `${process.env.REACT_APP_BACKEND}${args[0]}`
  return (args.length === 1 ? fetch(resource) : fetch(resource, args[1])).then(
    (response) => {
      if (response.status >= 400) {
        throw response
      }
      return response.json()
    }
  )
}

const authorizedFetcher = (token, ...args) => {
  const tokenHeader = {
    Authorization: `Bearer ${token}`,
  }
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
  )
}

const autoAuthorizedFetcher = (getAccessTokenSilently, ...args) => {
  return getAccessTokenSilently().then((token) =>
    authorizedFetcher(token, ...args)
  )
}

const useAuthorizedFetcher = () => {
  const { isAuthenticated, isLoading, error: errorAuth } = useAuth0()
  const { token, errorToken } = useToken()
  const [isFetching, setIsFetching] = useState(false)
  return {
    isLoading,
    isAuthenticated,
    authorizedFetcher: token
      ? (...args) => {
          setIsFetching(true)
          return authorizedFetcher(token, ...args).finally(() =>
            setIsFetching(false)
          )
        }
      : null,
    isFetching,
    error: errorToken || errorAuth,
  }
}

const useBackend = (key, ...args) => {
  const { token, errorToken } = useToken()
  const { data, error, mutate } = useSwr(
    key ? [key, token, JSON.stringify(args)] : null,
    (key) =>
      token ? authorizedFetcher(token, key, ...args) : fetcher(key, ...args)
  )
  return {
    data,
    error: error || errorToken,
    mutate,
  }
}

const useAuthorizedBackend = (key, ...args) => {
  const { token, errorToken } = useToken()
  const { data, error } = useSwr(token ? key : null, (key) =>
    authorizedFetcher(token, key, ...args)
  )
  return {
    data,
    error: error || errorToken,
  }
}

const useCrag = (cragId) => {
  const { data: crag, error } = useBackend(cragId ? `/crags/${cragId}` : null)
  return { crag, error }
}

const useSector = (sectorId) => {
  const { data: sector, error } = useBackend(
    sectorId ? `/sectors/${sectorId}` : null
  )
  return { sector, error }
}

const useClimb = (climbId) => {
  const { data: climb, error } = useBackend(
    climbId ? `/climbs/${climbId}` : null
  )
  return { climb, error }
}

const useImage = (imageId) => {
  const { data: image, error } = useBackend(
    imageId ? `/images/${imageId}` : null
  )
  return { image, error }
}

const useLine = (lineId) => {
  const { data: line, error } = useBackend(lineId ? `/lines/${lineId}` : null)
  return { line, error }
}

const useGradeSystemGrade = (gradeSystemGradeId) => {
  const { data: grade, error } = useBackend(
    gradeSystemGradeId ? `/grade-system-grades/${gradeSystemGradeId}` : null
  )
  return { grade, error }
}

const useUser = () => {
  const { user, error: auth0Error } = useAuth0()
  const { data, error, mutate } = useBackend(user ? `/users/${user.sub}` : null)
  return { user: { ...data, ...user }, error: error || auth0Error, mutate }
}

const useQuery = (collection, query, limit, offset) =>
  useBackend(
    collection && query
      ? `/${collection}/query?limit=${limit}&offset=${offset}`
      : null,
    {
      method: 'POST',
      body: JSON.stringify(query),
    }
  )

const useCrags = (query, limit = 20, offset = 0) => {
  const { data: crags, error } = useQuery('crags', query, limit, offset)
  return { crags, error }
}

const useSectors = (query, limit = 20, offset = 0) => {
  const { data: sectors, error } = useQuery('sectors', query, limit, offset)
  return { sectors, error }
}

const useClimbs = (query, limit = 20, offset = 0) => {
  const { data: climbs, error } = useQuery('climbs', query, limit, offset)
  return { climbs, error }
}

const useImages = (query, limit = 20, offset = 0) => {
  const { data: images, error } = useQuery('images', query, limit, offset)
  return { images, error }
}

const useLines = (query, limit = 20, offset = 0) => {
  const { data: lines, error } = useQuery('lines', query, limit, offset)
  return { lines, error }
}

const useGradeSystemGrades = () => {
  const { data: gradeSystemGrades, error } = useBackend('/grade-system-grades')
  return { gradeSystemGrades, error }
}

const countVotes = (votes) => {
  const countedVotes = Object.entries(
    votes.reduce((count, vote) => {
      const stringified = JSON.stringify(vote.value)
      if (stringified in count) {
        count[stringified] += 1
      } else {
        count[stringified] = 1
      }
      return count
    }, {})
  ).map(([value, votes]) => ({ value: JSON.parse(value), count: votes }))
  countedVotes.sort((countA, countB) => (countA.count > countB.count ? 1 : -1))
  return countedVotes
}

const mostVoted = (votes) =>
  !votes || votes.length === 0 ? null : countVotes(votes)[0].value

const conflicting = (votes) => {
  if (!votes || votes.length === 0) {
    return null
  } else {
    const countedVotes = countVotes(votes)
    const totalVotes = countedVotes.reduce((sum, vote) => sum + vote.count, 0)
    return countedVotes[0].count / totalVotes <= 0.75
  }
}

const useUserVote = (votes) => {
  const { user, isLoading: isLoadingUser, error } = useAuth0()
  const isLoading = isLoadingUser || !votes
  if (isLoading || error) {
    return {
      userVote: undefined,
      error,
    }
  } else {
    const userVotes = votes.filter((vote) => vote.user_id === user.sub)
    const userVote = userVotes && userVotes.length >= 1 ? userVotes[0] : null
    return {
      userVote,
      error,
    }
  }
}

const useSearchClimbs = (body, params) => {
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const { data: climbs, error } = useBackend(`/search-climbs?${paramString}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return { climbs, error }
}

export {
  useToken,
  fetcher,
  authorizedFetcher,
  autoAuthorizedFetcher,
  useAuthorizedFetcher,
  useBackend,
  useAuthorizedBackend,
  useCrag,
  useSector,
  useClimb,
  useImage,
  useLine,
  useGradeSystemGrade,
  useUser,
  useCrags,
  useSectors,
  useClimbs,
  useImages,
  useLines,
  useGradeSystemGrades,
  countVotes,
  mostVoted,
  conflicting,
  useUserVote,
  useSearchClimbs,
}
