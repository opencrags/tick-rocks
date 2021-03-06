import {
  Avatar,
  Box,
  Fade,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import CragPhotoPage from '../pages/crag-photo'
import { useUser } from '../utils/backend'
import ModalDialog from './modal-dialog'

function PhotoGrid({ cragPhotos, error, children, ...props }) {
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
        p="5px"
      >
        {cragPhotos.map((cragPhoto) => {
          return (
            <CragPhoto
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

function CragPhoto({ img, cragId, imgId, userId, ...props }) {
  const { isOpen, onToggle } = useDisclosure()
  const { user } = useUser(userId)
  return (
    <Box>
      <ModalDialog
        button={
          <Box
            h={{ base: '40vh', md: '60vh' }}
            width="100%"
            objectFit="cover"
            verticalAlign="bottom"
            bgImage={img}
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            position="relative"
            cursor="pointer"
          >
            <Box
              w="100%"
              position="absolute"
              bottom="0px"
              onPointerEnter={onToggle}
              onPointerLeave={onToggle}
            >
              <Fade in={isOpen}>
                <Box
                  p="25px"
                  pl="70px"
                  color="white"
                  bg="blackAlpha.700"
                  w="100%"
                  shadow="md"
                  position="absolute"
                  bottom="0px"
                >
                  Uploaded by {user?.display_name}
                </Box>
              </Fade>
              <Box padding="10px" position="absolute" left="0px" bottom="0px">
                <Avatar shadow="md" name={user?.display_name} />
              </Box>
            </Box>
          </Box>
        }
        size="4xl"
        width="100%"
      >
        <CragPhotoPage cragPhotoId={imgId} />
      </ModalDialog>
    </Box>
  )
}

export { PhotoGrid }
