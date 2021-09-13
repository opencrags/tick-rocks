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
  useColorModeValue,
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
export default function VoteClimbDescription() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { userVote, error: errorUserVote } = useUserVote(
    climb?.description_votes
  )
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const [climbDescription, setClimbDescription] = useState(null)
  const [publicVote, setPublicVote] = useState(true)
  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.100', 'gray.800')
  const inputBg = useColorModeValue('gray.300', 'gray.700')

  useEffect(() => {
    if (climbDescription === null && userVote) {
      setClimbDescription(userVote.value)
      setPublicVote(userVote.public)
    }
  }, [climbDescription, userVote])

  const voteClimbDescription = (climbId) => {
    const body = JSON.stringify({
      value: climbDescription,
      public: publicVote,
    })
    return userVote
      ? authorizedFetcher(
          `/climbs/${climbId}/description_votes/${userVote.id}`,
          {
            method: 'PUT',
            body: body,
          }
        )
      : authorizedFetcher(`/climbs/${climbId}/description_votes`, {
          method: 'POST',
          body: body,
        })
  }

  const navigateToClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () =>
    voteClimbDescription(climbId).then(() => navigateToClimb(climbId))

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
        <Container bg={bg} maxWidth="100%" flexGrow="1" padding="0px" pb="30px">
          <CragBanner cragId={cragId}>
            <ClimbBreadcrumb
              climbId={climbId}
              extra={[{ text: 'Vote for climb Description' }]}
            />
            <Heading>
              Edit:{' '}
              {climb.description_votes.length >= 1
                ? mostVoted(climb.description_votes)
                : 'No description votes'}{' '}
            </Heading>
          </CragBanner>
          <CragBannerMenu>
            <CragBannerMenuButton>Edit</CragBannerMenuButton>
          </CragBannerMenu>

          <Box>
            <Flex direction={{ base: 'column', md: 'row' }} justify="center">
              <Box bg={boxBg} padding="10px">
                <Votes
                  votes={climb.description_votes}
                  countedVoteItem={(countedVote) => (
                    <Text>
                      {countedVote.value} ({countedVote.count} votes)
                    </Text>
                  )}
                  onChange={(countedVote) => {
                    if (countedVote === null) {
                      setClimbDescription('')
                    } else {
                      setClimbDescription(countedVote.value)
                    }
                  }}
                  value={userVote?.value || null}
                />
                <Heading size="sm">Your vote</Heading>
                <FormControl isRequired>
                  <FormLabel>Climb Description</FormLabel>
                  <Input
                    bgColor={inputBg}
                    placeholder="Climb description"
                    value={climbDescription === null ? '' : climbDescription}
                    onChange={(event) =>
                      setClimbDescription(event.target.value)
                    }
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

                <Button onClick={handleSubmit}>Submit</Button>
              </Box>
            </Flex>
          </Box>
        </Container>
      </Flex>
    </Box>
  )
}
