import {
  Box,
  Text,
  SimpleGrid,
  useDisclosure,
  SlideFade,
} from '@chakra-ui/react'
import React from 'react'
import { useCragPhotos, useUser } from '../utils/backend'

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
        {cragPhotos.map((cragPhoto) => {
          return (
            <CragPhotos
              key={cragPhoto.id}
              img={cragPhoto.base64_image}
              user={cragPhoto.user_id}
            />
          )
        })}
      </SimpleGrid>
    </Box>
  )
}

function CragPhotos({ img, user, ...props }) {
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
        <SlideFade in={isOpen}>
          <Box
            p="20px"
            color="white"
            mt="4"
            bg="gray.500"
            maxW="95%"
            roundedRight="md"
            shadow="md"
            position="absolute"
            left="0px"
          >
            Uploaded by {user}
          </Box>
        </SlideFade>
      </Box>
    </Box>
  )
}

export { CragPhotoGrid }
