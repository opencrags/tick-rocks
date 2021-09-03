import { Link as RouterLink } from 'react-router-dom'
import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { Button } from '@chakra-ui/button'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react'

import AddCrag from '../pages/add-crag.js'

export default function ModalDialog({ button, children, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box onClick={onOpen}>{button}</Box>

      <Modal {...props} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent marginTop="10vh" py="20px">
          <ModalCloseButton />
          {children}
        </ModalContent>
      </Modal>
    </>
  )
}
