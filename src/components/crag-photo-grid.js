import {
  Box,
  Text,
  SimpleGrid,
  useDisclosure,
  SlideFade,
  LinkBox,
} from '@chakra-ui/react'

import { Link as RouterLink, useParams } from 'react-router-dom'
import React from 'react'
import { useCragPhotos, useUser } from '../utils/backend'

function CragPhotoGrid({ userId, cragId, children, ...props }) {
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
              cragId={cragPhoto.crag_id}
              imgId={cragPhoto.id}
              img={cragPhoto.base64_image}
              userId={cragPhoto.user_id}
            />
          )
        })}
      </SimpleGrid>
    </Box>
  )
}

function CragPhotos({ img, cragId, imgId, userId, ...props }) {
  const { isOpen, onToggle } = useDisclosure()
  const { user } = useUser(userId)
  return (
    <Box onPointerEnter={onToggle} onPointerLeave={onToggle}>
      <LinkBox as={RouterLink} to={`/crags/${cragId}/crag-photo/${imgId}`}>
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
              Uploaded by {user.display_name}
            </Box>
          </SlideFade>
        </Box>
      </LinkBox>
    </Box>
  )
}

export { CragPhotoGrid }
