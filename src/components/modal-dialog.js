import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
  Button,
} from '@chakra-ui/react'

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
