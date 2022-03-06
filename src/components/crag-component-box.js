import { Box } from '@chakra-ui/react'
import React from 'react'

function CragComponentBox({ children, ...props }) {
  return (
    <Box
      pl={{ base: '0px', md: '10vw' }}
      pr={{ base: '0px', md: '10vw' }}
      {...props}
    >
      {children}
    </Box>
  )
}

export { CragComponentBox }
