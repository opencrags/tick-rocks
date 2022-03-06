import {
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import Grade from '../components/grade.js'
import Loader from '../components/loader.js'
import Votes from '../components/votes.js'
import {
  mostVoted,
  useAuthorizedFetcher,
  useClimb,
  useGradeSystemGrade,
  useGradeSystemGrades,
  useUserVote,
} from '../utils/backend.js'

export default function VoteClimbGrade() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { userVote, error: errorUserVote } = useUserVote(climb?.grade_votes)
  const {
    authorizedFetcher,
    isLoading,
    error: authError,
  } = useAuthorizedFetcher()
  const history = useHistory()
  const { gradeSystemGrades, error: errorGradeSystemGrades } =
    useGradeSystemGrades()
  const [gradeSystem, setGradeSystem] = useState(null)
  const [gradeId, setGradeId] = useState(null)
  const [publicVote, setPublicVote] = useState(true)

  const { grade: previouslyVotedGrade, error: errorPreviouslyVotedGrade } =
    useGradeSystemGrade(userVote?.value)

  useEffect(() => {
    if (gradeId === null && previouslyVotedGrade) {
      setGradeId(previouslyVotedGrade.id)
      setGradeSystem(previouslyVotedGrade.system)
      setPublicVote(userVote.public)
    }
  }, [gradeId, userVote, previouslyVotedGrade])

  const { grade: mostVotedGrade, error: errorMostVotedGrade } =
    useGradeSystemGrade(climb ? mostVoted(climb.grade_votes) : null)

  useEffect(() => {
    if (mostVotedGrade && gradeId === null && gradeSystem === null) {
      setGradeSystem(mostVotedGrade.system)
    }
  }, [mostVotedGrade, gradeId, gradeSystem])

  const voteClimbGrade = (climbId) =>
    userVote
      ? authorizedFetcher(`/climbs/${climbId}/grade_votes/${userVote.id}`, {
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
    errorClimb ||
    errorPreviouslyVotedGrade ||
    errorGradeSystemGrades ||
    errorMostVotedGrade ||
    errorUserVote
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
    climb === undefined ||
    gradeSystemGrades === undefined ||
    userVote === undefined
  ) {
    return <Loader />
  }

  const systems = [
    ...new Set(
      gradeSystemGrades.map((gradeSystemGrade) => gradeSystemGrade.system)
    ),
  ]

  return (
    <Container maxWidth="container.md">
      <ClimbBreadcrumb climbId={climbId} extra={[{ text: 'Vote for grade' }]} />
      <Heading>Vote for grade</Heading>
      <Votes
        votes={climb.grade_votes}
        countedVoteItem={(countedVote) => (
          <HStack>
            <Grade gradeId={countedVote.value} />
            <Text>({countedVote.count} votes)</Text>
          </HStack>
        )}
        onChange={(countedVote) => {
          if (countedVote === null) {
            setGradeId('')
          } else {
            setGradeId(countedVote.value)
          }
        }}
        value={userVote?.value || null}
      />
      <Heading size="sm">Your vote</Heading>
      <FormControl isRequired>
        <FormLabel>Grade system</FormLabel>
        <Select
          value={gradeSystem || ''}
          onChange={(event) => {
            setGradeSystem(event.target.value)
            setGradeId(null)
          }}
        >
          <option value={''}></option>
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
          value={gradeId || ''}
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
