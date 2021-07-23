import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import TopoPlotter from './topo-plotter'

export default function LineDrawerModal({
  isOpen,
  onClose,
  image,
  setLinePath,
  lines,
}) {
  const [currentPoints, setCurrentPoints] = useState([])

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Route</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems="start">
            <Text>
              Click or tap to define new route. First point will be the start.
            </Text>
            <TopoPlotter
              image={image}
              currentPoints={currentPoints}
              setCurrentPoints={setCurrentPoints}
              lines={lines}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack justify="space-between" w="100%">
            <Button
              onClick={() => {
                setLinePath(null)
                setCurrentPoints([])
              }}
            >
              Clear points
            </Button>
            <Button
              onClick={() => {
                onClose()
                setLinePath(currentPoints)
              }}
              disabled={currentPoints.length < 2}
            >
              Add
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
