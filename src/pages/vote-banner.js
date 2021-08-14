import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  Box,
  Progress,
  Image,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CragBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import {
  useCrag,
  useAuthorizedFetcher,
  useUserVote,
  useCragPhotos,
  countVotes,
} from '../utils/backend.js'

export default function VoteBanner() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { cragPhotos, errorCragPhotos } = useCragPhotos({ crag_id: cragId })
  const { userVote, error: errorUserVote } = useUserVote(crag?.banner_votes)
  const {
    authorizedFetcher,
    isLoading,
    error: errorAuth,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [banner, setBanner] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (banner === null && userVote) {
      setBanner(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [banner, userVote])

  const voteBanner = () => {
    const body = JSON.stringify({
      value: banner,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(`/crags/${cragId}/banner_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/crags/${cragId}/banner_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToCrag = () => history.replace(`/crags/${cragId}`)

  const handleSubmit = () => voteBanner().then(navigateToCrag)

  if (errorAuth || errorCrag || errorUserVote || errorCragPhotos) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load page.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && !isLoading) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">You need to login to vote.</Text>
        </Center>
      </Container>
    )
  }

  if (
    crag === undefined ||
    userVote === undefined ||
    cragPhotos === undefined
  ) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <CragBreadcrumb
        cragId={cragId}
        extra={[{ text: 'Vote for crag banner' }]}
      />
      <Heading>Vote for crag banner</Heading>
      <BannerVotes
        voteOptions={cragPhotos}
        votes={crag.banner_votes}
        onChange={(cragPhotoId) => {
          if (cragPhotoId === null) {
            setBanner('')
          } else {
            setBanner(cragPhotoId)
          }
        }}
        value={userVote?.value || null}
      />
      <Text>Add a crag photo if you want to chose from another option.</Text>
      <Heading size="sm">Your vote</Heading>
      <FormControl>
        <FormLabel>Anonymous</FormLabel>
        <Checkbox
          isChecked={!publicVote}
          onChange={() => {
            setPublicVote(!publicVote)
          }}
        />
        <Text fontSize="sm">
          You can vote anonymously if you want but your vote will have a
          slightly lower value than if you openly support it.
        </Text>
      </FormControl>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}

export function BannerVotes({ voteOptions, votes, value, onChange }) {
  const countedVotes = countVotes(votes)
  const maxVoteCount = Math.max(countedVotes.map(({ count }) => count))
  const [checkboxes, setCheckboxes] = useState(
    voteOptions.map(
      (voteOption) => JSON.stringify(voteOption.id) === JSON.stringify(value)
    )
  )
  const countedVotesDict = countedVotes.reduce(
    (dict, countedVote) => ({
      [countedVote.value]: countedVote.count,
      ...dict,
    }),
    {}
  )

  return (
    <Box marginBottom="10px">
      <Heading size="sm">Votes</Heading>
      {voteOptions.length === 0 ? (
        <Text>There are no crag photos.</Text>
      ) : (
        voteOptions.map((voteOption, index) => (
          <Box key={voteOption.id}>
            <Image
              src={voteOption.base64_image}
              maxWidth="200px"
              height="200px"
              marginTop="16px"
            />
            <Checkbox
              isChecked={checkboxes[index]}
              onChange={() => {
                const newCheckboxes = checkboxes.map(() => false)
                newCheckboxes[index] = !checkboxes[index]
                setCheckboxes(newCheckboxes)
                if (newCheckboxes[index]) {
                  onChange(voteOption.id)
                } else {
                  onChange(null)
                }
              }}
            >
              <Text>({countedVotesDict[voteOption.id] || 0} votes)</Text>
            </Checkbox>
            <Progress
              value={
                ((voteOption.id in countedVotesDict
                  ? countedVotesDict[voteOption.id]
                  : 0) /
                  maxVoteCount) *
                100
              }
            />
          </Box>
        ))
      )}
    </Box>
  )
}
