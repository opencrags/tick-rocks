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
  RadioGroup,
  Radio,
  Stack,
  VStack,
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import { useAuthorizedFetcher } from '../utils/backend.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import StarRatings from 'react-star-ratings'
import React from 'react'

export default function AddAscent() {
  const { cragId, sectorId, climbId } = useParams()
  const history = useHistory()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [ascentDate, setAscentDate] = useState(Date.now())
  const [attempts, setAttempts] = useState(null)
  const [anonymous, setAnonymous] = useState(false)
  const [ascentType, setAscentType] = useState('redpoint')
  const [description, setDescription] = useState(null)
  console.log(description)
  const addAscent = () =>
    authorizedFetcher('/ascents', {
      method: 'POST',
      body: JSON.stringify({
        climb_id: climbId,
        ascent_date: ascentDate,
        ascent_type: ascentType,
        attempts: attempts,
        description: description,
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
          <RadioGroup onChange={setAscentType} value={ascentType}>
            <VStack alignItems="right" direction="row">
              <Radio value="flash">Flash</Radio>
              <Radio value="onsight">On-sight</Radio>
              <Radio value="redpoint">Redpoint</Radio>
            </VStack>
          </RadioGroup>
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
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            onChange={(event) => setDescription(event.target.value)}
            defaultValue={description}
          ></Input>
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
