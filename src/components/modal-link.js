import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/modal'

import { Box } from '@chakra-ui/layout'

import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'

export default function ModalLink({ title, to, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent size="xl">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
