import { Box, SimpleGrid, Center, Flex } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useImages } from '../utils/backend.js'

function CragSectorGrid({ children, ...props }) {
  return (
    <Box>
      <SimpleGrid
        display={{ base: 'flex', md: 'grid' }}
        overflowX="auto"
        columns={[2, 3, 3, 4, 5]}
        gridAutoFlow="row dense"
        spacing="5px"
        marginLeft="10px"
        marginRight="10px"
        position="relative"
      >
        {children}
      </SimpleGrid>
    </Box>
  )
}

function CragSector({ cragId, sectorId, children, ...props }) {
  const { images, error: errorImages } = useImages({ sector_id: sectorId })

  return (
    <Box
      as={RouterLink}
      to={`/crags/${cragId}/sectors/${sectorId}`}
      flexGrow="1"
      height="100%"
      width="100%"
      position="relative"
    >
      <Box
        flexGrow="1"
        w={{ base: '22.25vw', md: 'unset' }}
        h={{ base: '20vh', lg: '30vh' }}
        objectFit="cover"
        verticalAlign="bottom"
        bgImage={
          images !== undefined && images.length > 0
            ? images[0].base64_image
            : 'https://27crags.s3.amazonaws.com/photos/000/075/75038/size_xl-51f3b20cc4af.png'
        }
        bgColor="Gray.100"
        bgPosition="center"
        borderRadius="5px"
        bgRepeat="no-repeat"
        bgSize="cover"
        position="relative"
        _hover={{ transform: 'scale(0.98)' }}
        transition="all .2s"
        mb="10px"
      >
        <Box
          bg="blackAlpha.500"
          borderTopRadius="5px"
          w="100%"
          color="white"
          fontWeight="normal"
          fontSize="md"
          letterSpacing="1.5pt"
        >
          <Center>{children}</Center>
        </Box>
      </Box>
    </Box>
  )
}

export { CragSectorGrid, CragSector }
