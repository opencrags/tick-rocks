import {
  Container,
  Center,
  Heading,
  Text,
  Select,
  FormControl,
  FormLabel,
  Button,
  HStack,
  Box,
  Progress,
  Checkbox,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom'
import Loader from '../components/loader.js'
import Grade from '../components/grade.js'
import { useAuth0 } from '@auth0/auth0-react'
import {
  useCrag,
  useSector,
  useClimb,
  useGradeSystemGrade,
  useGradeSystemGrades,
  useAuthorizedFetcher,
  countVotes,
  mostVoted,
} from '../utils/backend.js'

export default function VoteClimbGrade() {
  const { cragId, sectorId, climbId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const { climb, error: errorClimb } = useClimb(climbId)
  const { user } = useAuth0()
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const { gradeSystemGrades, error: errorGradeSystemGrades } =
    useGradeSystemGrades()
  const [gradeSystem, setGradeSystem] = useState('')
  const [gradeId, setGradeId] = useState('')
  const [publicVote, setPublicVote] = useState(true)

  const userVote = useCallback(() => {
    if (climb && user) {
      const userVotes = climb.grade_votes.filter(
        (name_vote) => name_vote.user_id === user.sub
      )
      if (userVotes.length === 1) {
        return userVotes[0]
      } else {
        return null
      }
    } else {
      return null
    }
  }, [climb?.grade_votes, user?.sub])

  const { grade: previouslyVotedGrade, error: errorPreviouslyVotedGrade } =
    useGradeSystemGrade(userVote() ? userVote().value : null)

  useEffect(() => {
    if (gradeId === '' && previouslyVotedGrade) {
      setGradeId(previouslyVotedGrade.id)
      setGradeSystem(previouslyVotedGrade.system)
      setPublicVote(userVote().public)
    }
  }, [previouslyVotedGrade])

  const { grade: mostVotedGrade, error: errorMostVotedGrade } =
    useGradeSystemGrade(climb ? mostVoted(climb.grade_votes) : null)

  useEffect(() => {
    if (mostVotedGrade && gradeId === '' && gradeSystem === '') {
      setGradeSystem(mostVotedGrade.system)
    }
  }, [mostVotedGrade])

  const voteClimbGrade = (climbId) =>
    userVote()
      ? authorizedFetcher(`/climbs/${climbId}/grade_votes/${userVote().id}`, {
          method: 'PUT',
          body: JSON.stringify({
            value: gradeId,
            public: publicVote,
          }),
        })
      : authorizedFetcher(`/climbs/${climbId}/grade_votes`, {
          method: 'POST',
          body: JSON.stringify({
            value: gradeId,
            public: publicVote,
          }),
        })

  const navigateToClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () =>
    voteClimbGrade(climbId).then(() => navigateToClimb(climbId))

  if (
    authError ||
    errorCrag ||
    errorSector ||
    errorClimb ||
    errorPreviouslyVotedGrade ||
    errorGradeSystemGrades ||
    errorMostVotedGrade
  ) {
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
    sector === undefined ||
    climb === undefined ||
    gradeSystemGrades === undefined
  ) {
    return <Loader />
  }

  const countedVotes = countVotes(climb.grade_votes)
  const maxVoteCount = Math.max(Object.values(countedVotes))
  const systems = [
    ...new Set(
      gradeSystemGrades.map((gradeSystemGrade) => gradeSystemGrade.system)
    ),
  ]

  return (
    <Container maxWidth="container.md">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/crags/${cragId}`}>
            {mostVoted(crag.name_votes)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}`}
          >
            {mostVoted(sector.name_votes)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`}
          >
            {mostVoted(climb.name_votes)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Text>Vote for grade</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading>Vote for grade</Heading>
      <Box
        border="1px"
        borderColor="gray.300"
        borderRadius="md"
        padding="10px"
        margin="20px"
      >
        <Heading size="sm">Votes</Heading>
        {countedVotes.length === 0 ? (
          <Text>There are no votes.</Text>
        ) : (
          countedVotes.map((vote) => (
            <Box key={vote.value}>
              <HStack>
                <Grade gradeId={vote.value} />
                <Text>({vote.count} votes)</Text>
              </HStack>
              <Progress value={vote.count / maxVoteCount} />
            </Box>
          ))
        )}
      </Box>
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Grade system</FormLabel>
        <Select
          value={gradeSystem}
          onChange={(event) => {
            setGradeSystem(event.target.value)
            setGradeId(null)
          }}
        >
          <option value={null}></option>
          {systems.map((system) => (
            <option key={system} value={system}>
              {system}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Grade</FormLabel>
        <Select
          value={gradeId}
          placeholder=""
          onChange={(event) => setGradeId(event.target.value)}
        >
          <option value={null}></option>
          {gradeSystemGrades
            .filter(
              (gradeSystemGrade) => gradeSystemGrade.system === gradeSystem
            )
            .map((gradeSystemGrade) => (
              <option key={gradeSystemGrade.id} value={gradeSystemGrade.id}>
                {gradeSystemGrade.grade}
              </option>
            ))}
        </Select>
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
          You can vote anonymously if you want but your vote will have a
          slightly lower value than if you openly support it.
        </Text>
      </FormControl>

      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}
