import { Link as RouterLink } from 'react-router-dom'
import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { Button } from '@chakra-ui/button'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
} from '@chakra-ui/react'

export default function DrawerDialog({
  button,
  header,
  footer,
  children,
  placement,
  ...props
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <>
      <Box ref={btnRef} colorScheme="teal" onClick={onOpen}>
        {button}
      </Box>
      <Drawer
        preserveScrollBarGap={1}
        isOpen={isOpen}
        placement={placement}
        onClose={onClose}
        finalFocusRef={btnRef}
        del
        {...props}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>{header}</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>{children}</DrawerBody>
          <DrawerFooter alignSelf="flex-start">{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>{' '}
    </>
  )
}
