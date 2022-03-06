import { useDisclosure } from '@chakra-ui/hooks'
import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import React from 'react'

export default function ModalDialog({
  padding = '20px',
  button,
  children,
  ...props
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box onClick={onOpen}>{button}</Box>

      <Modal
        {...props}
        isOpen={isOpen}
        onClose={onClose}
        preserveScrollBarGap={1}
      >
        <ModalOverlay />
        <ModalContent marginTop="10vh" py={padding}>
          <ModalCloseButton />
          {children}
        </ModalContent>
      </Modal>
    </>
  )
}
