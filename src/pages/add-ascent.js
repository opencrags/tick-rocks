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
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import { useAuthorizedFetcher } from '../utils/backend.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import StarRatings from 'react-star-ratings'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'

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
      <Heading size="md">Add ascent</Heading>
      <HStack my="20px">
        <FormControl isRequired>
          <FormLabel>Ascent date</FormLabel>
          <Input
            as={DatePicker}
            variant="flushed"
            selected={ascentDate}
            onChange={setAscentDate}
          />
        </FormControl>
        <FormControl alignItems="right">
          <FormLabel>Ascent type</FormLabel>
          <HStack>
            <Text> Rotpunkt</Text> <MdRadioButtonChecked />
          </HStack>
          <HStack>
            <Text> Flash</Text> <MdRadioButtonUnchecked />
          </HStack>
        </FormControl>
      </HStack>
      <HStack my="20px">
        <FormControl>
          <FormLabel>Grade opinion</FormLabel>
          <Input defaultValue="7A" variant="flushed" />
        </FormControl>
        <FormControl>
          <FormLabel>Rating</FormLabel>
          <StarRatings
            rating={2}
            starRatedColor="gold"
            numberOfStars={5}
            name="rating"
            starEmptyColor="gray"
            starDimension="20px"
            starSpacing="2px"
          />
        </FormControl>
      </HStack>
      <HStack my="20px">
        <FormControl isRequired>
          <FormLabel>Number of attempts</FormLabel>
          <NumberInput
            variant="flushed"
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
      </HStack>
      <HStack>
        <FormControl>
          <FormLabel>Anonymous</FormLabel>
          <Checkbox
            isChecked={anonymous}
            onChange={() => {
              setAnonymous(!anonymous)
            }}
          />
        </FormControl>
        <Button color="white" colorScheme="brand" onClick={handleSubmit}>
          Submit
        </Button>{' '}
      </HStack>
    </Container>
  )
}
