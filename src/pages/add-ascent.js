import {
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useParams } from 'react-router-dom'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import { TickRocksLogo } from '../components/tick-rocks-logo.js'
import {
  useAuthorizedFetcher,
  useBackendMatchMutate,
} from '../utils/backend.js'

export default function AddAscent({ ascent }, onClose) {
  const { climbId } = useParams()
  const { authorizedFetcher, isLoading, authError } = useAuthorizedFetcher()
  const [ascentDate, setAscentDate] = useState(Date.now())
  const [editAscentDate, setEditAscentDate] = useState(
    Date.parse(ascent?.ascent_date)
  )
  const [attempts, setAttempts] = useState(null)
  const [editAttempts, setEditAttempts] = useState(ascent?.attempts)
  const [anonymous, setAnonymous] = useState(false)
  const [ascentType, setAscentType] = useState(null)
  const [editAscentType, setEditAscentType] = useState(ascent?.ascent_type)
  const [description, setDescription] = useState(null)
  const [editDescription, setEditDescription] = useState(ascent?.description)
  const backendMatchMutate = useBackendMatchMutate()

  const editAscent = () =>
    authorizedFetcher(`/ascents/${ascent.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        climb_id: climbId,
        ascent_date: editAscentDate,
        ascent_type: editAscentType,
        attempts: editAttempts,
        description: editDescription,
        public: !anonymous,
      }),
    })

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

  const handleSubmit = () => {
    if (ascent != null) {
      editAscent().then(() => backendMatchMutate(/^.*\/ascents.*$/))
    } else {
      addAscent().then(() => backendMatchMutate(/^.*\/ascents.*$/))
    }
  }

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
      <ClimbBreadcrumb
        climbId={climbId}
        extra={[{ text: `${ascent ? 'Edit' : 'Add'} ascent` }]}
      />
      <Heading size="md">{ascent ? 'Edit' : 'Add'} ascent</Heading>
      <HStack my="20px">
        <FormControl isRequired>
          <FormLabel>Ascent date</FormLabel>
          <Input
            as={DatePicker}
            variant="flushed"
            selected={ascent ? editAscentDate : ascentDate}
            onChange={ascent ? setEditAscentDate : setAscentDate}
          />
        </FormControl>
        <FormControl alignItems="right" isRequired>
          <FormLabel>Ascent type</FormLabel>
          <RadioGroup
            onChange={ascent ? setEditAscentType : setAscentType}
            value={ascent ? editAscentType : ascentType}
          >
            <VStack alignItems="right" direction="row">
              <Radio value="flash">Flash</Radio>
              <Radio value="onsight">On-sight</Radio>
              <Radio value="redpoint">Redpoint</Radio>
            </VStack>
          </RadioGroup>
        </FormControl>
      </HStack>
      <HStack my="20px">
        <FormControl isRequired>
          <FormLabel>Number of attempts</FormLabel>
          <NumberInput
            variant="flushed"
            step={1}
            min={1}
            defaultValue={ascent ? editAttempts : attempts}
            onChange={ascent ? setEditAttempts : setAttempts}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </HStack>
      <HStack my="20px">
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            onChange={
              ascent
                ? (event) => setEditDescription(event.target.value)
                : (event) => setDescription(event.target.value)
            }
            defaultValue={ascent ? editDescription : description}
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
          <TickRocksLogo
            colorGreen="#fff"
            colorWhite="#3CAB70"
            h="15px"
            w="40px"
            mr="5px"
          />
          tick
        </Button>
      </HStack>
    </Container>
  )
}
