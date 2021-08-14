import {
  Box,
  Text,
  SimpleGrid,
  useDisclosure,
  SlideFade,
} from '@chakra-ui/react'
import React from 'react'
import { useCragPhotos } from '../utils/backend'

function CragPhotoGrid({ cragId, children, ...props }) {
  const { cragPhotos, error } = useCragPhotos({ crag_id: cragId })

  if (cragPhotos === undefined) {
    return ''
  }

  if (error) {
    return <Text>Error fetching photos</Text>
  }

  return (
    <Box>
      {children}
      <SimpleGrid
        columns={[1, 2, 2, 2, 3]}
        gridAutoFlow="row dense"
        spacing="5px"
        margin="5px"
      >
        {cragPhotos.map((cragPhoto) => (
          <CragPhotos key={cragPhoto.id} img={cragPhoto.base64_image} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

function CragPhotos({ img, ...props }) {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Box onPointerEnter={onToggle} onPointerLeave={onToggle}>
      <Box
        FlexGrow="1"
        h={{ base: '40vh', md: '60vh' }}
        width="100%"
        objectFit="cover"
        verticalAlign="bottom"
        bgImage={img}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        position="relative"
      >
        <SlideFade in={isOpen} offsetY="-20px">
          <Box
            p="40px"
            color="white"
            mt="4"
            bg="gray.500"
            roundedRight="md"
            shadow="md"
            position="absolute"
            left="0px"
          >
            Uploaded by Rasmus Eriksson
          </Box>
        </SlideFade>
      </Box>
    </Box>
  )
}

export { CragPhotoGrid }
