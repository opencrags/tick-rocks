import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { SectorBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import {
  useAuthorizedFetcher,
  useGradeSystemGrades,
  useSector,
} from '../utils/backend.js'

export default function AddClimb() {
  const { cragId, sectorId } = useParams()
  const { sector, error: errorSector } = useSector(sectorId)
  const { gradeSystemGrades, error: errorGradeSystemGrades } =
    useGradeSystemGrades()

  const history = useHistory()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [climbName, setClimbName] = useState('')
  const [gradeSystem, setGradeSystem] = useState(null)
  const [grade, setGrade] = useState(null)

  const addClimb = () =>
    authorizedFetcher('/climbs', {
      method: 'POST',
      body: JSON.stringify({ crag_id: cragId, sector_id: sectorId }),
    })

  const voteClimbName = (climbId) =>
    authorizedFetcher(`/climbs/${climbId}/name_votes`, {
      method: 'POST',
      body: JSON.stringify({
        value: climbName,
        public: true,
      }),
    })

  const voteGrade = (climbId) =>
    grade
      ? authorizedFetcher(`/climbs/${climbId}/grade_votes`, {
          method: 'POST',
          body: JSON.stringify({
            value: grade,
            public: true,
          }),
        })
      : Promise.resolve()

  const navigateToAddedClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () =>
    addClimb().then((climb) =>
      Promise.all([voteGrade(climb.id), voteClimbName(climb.id)]).then(() =>
        navigateToAddedClimb(climb.id)
      )
    )

  if (authError || errorSector || errorGradeSystemGrades) {
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
          <Text margin="20px">You need to login to add stuff and vote.</Text>
        </Center>
      </Container>
    )
  }

  if (
    (!authorizedFetcher && isLoading) ||
    sector === undefined ||
    gradeSystemGrades === undefined
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
      <SectorBreadcrumb sectorId={sectorId} extra={[{ text: 'Add climb' }]} />
      <Heading>Add climb</Heading>
      <FormControl isRequired>
        <FormLabel>Climb name</FormLabel>
        <Input
          placeholder="Climb name"
          onChange={(event) => setClimbName(event.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Grade system</FormLabel>
        <Select
          onChange={(event) => {
            setGradeSystem(event.target.value)
            setGrade(null)
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
      <FormControl>
        <FormLabel>Grade</FormLabel>
        <Select
          placeholder=""
          onChange={(event) => setGrade(event.target.value)}
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
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}
