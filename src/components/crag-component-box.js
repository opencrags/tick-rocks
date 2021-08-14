import {
  Box,
  Heading,
  Flex,
  Avatar,
  Text,
  Tooltip,
  Spacer,
  Button,
  Stack,
} from '@chakra-ui/react'
import React from 'react'

function CragComponentBox({ children, ...props }) {
  return (
    <Box
      pl={{ base: '0px', md: '5vw' }}
      pr={{ base: '0px', md: '5vw' }}
      {...props}
    >
      {children}
    </Box>
  )
}

export { CragComponentBox }
