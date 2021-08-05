import {
  Box,
  Image,
  SimpleGrid,
  Flex,
  Center,
  Heading,
  Spacer,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'

function CragSectorGrid({ children, ...props }) {
  return (
    <Box>
      <SimpleGrid
        columns={[2, 3, 3, 4, 5]}
        gridAutoFlow="row dense"
        spacing="5px"
        margin="0px"
        position="relative"
      >
        {children}
      </SimpleGrid>
    </Box>
  )
}

function CragSector({ img, to, children, ...props }) {
  return (
    <Box
      as={RouterLink}
      to={to}
      FlexGrow="1"
      height="100%"
      width="100%"
      position="relative"
    >
      <Box
        FlexGrow="1"
        h={{ base: '20vh', lg: '30vh' }}
        objectFit="cover"
        verticalAlign="bottom"
        bgImage={img}
        bgColor="Gray.100"
        bgPosition="center"
        borderRadius="5px"
        bgRepeat="no-repeat"
        bgSize="cover"
        position="relative"
        _hover={{ transform: 'scale(0.98)' }}
        transition="all .2s"
      >
        <Box
          bg="blackAlpha.500"
          borderTopRadius="5px"
          w="100%"
          color="white"
          fontWeight="normal"
          fontSize="lg"
          letterSpacing="1.5pt"
        >
          <Center>{children}</Center>
        </Box>
      </Box>
    </Box>
  )
}

export { CragSectorGrid, CragSector }
