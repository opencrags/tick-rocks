import { useDisclosure } from '@chakra-ui/hooks'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import React from 'react'

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
