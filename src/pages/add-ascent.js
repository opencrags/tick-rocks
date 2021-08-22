import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Select,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import { useAuthorizedFetcher } from '../utils/backend.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function AddAscent() {
  const { cragId, sectorId, climbId } = useParams()

  const history = useHistory()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [ascentDate, setAscentDate] = useState(Date.now())
  const [attempts, setAttempts] = useState(null)
  const [anonymous, setAnonymous] = useState(false)

  const addAscent = () =>
    authorizedFetcher('/ascents', {
      method: 'POST',
      body: JSON.stringify({
        climb_id: climbId,
        ascent_date: ascentDate,
        attempts: attempts,
        public: !anonymous,
      }),
    })

  const navigateToClimb = () =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`)

  const handleSubmit = () => addAscent().then(navigateToClimb)

  if (authError) {
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

  if (!authorizedFetcher && isLoading) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <ClimbBreadcrumb climbId={climbId} extra={[{ text: 'Add ascent' }]} />
      <Heading>Add ascent</Heading>
      <FormControl isRequired>
        <FormLabel>Ascent date</FormLabel>
        <DatePicker selected={ascentDate} onChange={setAscentDate} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Number of attempts</FormLabel>
        <NumberInput
          step={1}
          defaultValue={attempts}
          min={1}
          onChange={setAttempts}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {attempts == 1 && (
          <Box>
            <Alert status="success">
              <AlertIcon />
              Flash!
            </Alert>
          </Box>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>Anonymous</FormLabel>
        <Checkbox
          isChecked={anonymous}
          onChange={() => {
            setAnonymous(!anonymous)
          }}
        />
      </FormControl>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}
