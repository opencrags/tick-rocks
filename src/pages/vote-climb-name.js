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
  Flex,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  useClimb,
  useAuthorizedFetcher,
  useUserVote,
  mostVoted,
} from '../utils/backend.js'

import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import Votes from '../components/votes.js'
import {
  CragBanner,
  CragBannerMenu,
  CragBannerMenuButton,
} from '../components/crag-banner.js'
export default function VoteClimbName() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { userVote, error: errorUserVote } = useUserVote(climb?.name_votes)
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [climbName, setClimbName] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  useEffect(() => {
    if (climbName === null && userVote) {
      setClimbName(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [climbName, userVote])

  const voteClimbName = (climbId) => {
    const body = JSON.stringify({
      value: climbName,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(`/climbs/${climbId}/name_votes/${userVote.id}`, {
          method: 'PUT',
          body: body,
        })
      : authorizedFetcher(`/climbs/${climbId}/name_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () =>
    voteClimbName(climbId).then(() => navigateToClimb(climbId))

  if (authError || errorClimb || errorUserVote) {
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

  if (!climb || userVote === undefined) {
    return <Loader />
  }

  return (
    <Box>
      <Flex direction="column" height="95vh">
        <Container
          bg="brand.100"
          maxWidth="100%"
          flexGrow="1"
          padding="0px"
          pb="30px"
        >
          <CragBanner cragId={cragId}>
            <ClimbBreadcrumb
              climbId={climbId}
              extra={[{ text: 'Vote for climb name' }]}
            />
            <Heading>
              Edit:{' '}
              {climb.name_votes.length >= 1
                ? mostVoted(climb.name_votes)
                : 'No name votes'}{' '}
            </Heading>
          </CragBanner>
          <CragBannerMenu>
            <CragBannerMenuButton>Edit</CragBannerMenuButton>
          </CragBannerMenu>

          <Box color="white">
            <Flex direction={{ base: 'column', md: 'row' }} justify="center">
              <Box bg="gray.800" padding="10px">
                <Votes
                  votes={climb.name_votes}
                  countedVoteItem={(countedVote) => (
                    <Text>
                      {countedVote.value} ({countedVote.count} votes)
                    </Text>
                  )}
                  onChange={(countedVote) => {
                    if (countedVote === null) {
                      setClimbName('')
                    } else {
                      setClimbName(countedVote.value)
                    }
                  }}
                  value={userVote?.value || null}
                />
                <Heading size="sm">Your vote</Heading>
                <FormControl isRequired>
                  <FormLabel>Climb name</FormLabel>
                  <Input
                    bgColor="gray.900"
                    placeholder="Climb name"
                    value={climbName === null ? '' : climbName}
                    onChange={(event) => setClimbName(event.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Anonymous</FormLabel>
                  <Checkbox
                    isChecked={!publicVote}
                    onChange={() => {
                      setPublicVote(!publicVote)
                    }}
                  />
                  <Text fontSize="sm">
                    You can vote anonymously if you want but your vote will have
                    a slightly lower value than if you openly support it.
                  </Text>
                </FormControl>

                <Button color="black" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </Flex>
          </Box>
        </Container>
      </Flex>
    </Box>
  )
}
