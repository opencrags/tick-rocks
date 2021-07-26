import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  useCrag,
  useSector,
  useGradeSystemGrades,
  useAuthorizedFetcher,
} from '../utils/backend.js'

export default function AddClimb() {
  const { cragId, sectorId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
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

  if (authError || errorCrag || errorSector || errorGradeSystemGrades) {
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
    crag === undefined ||
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
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/crags/${cragId}`}>
            {crag.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}`}
          >
            {sector.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Text>Add climb</Text>
        </BreadcrumbItem>
      </Breadcrumb>
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
