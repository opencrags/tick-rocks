import { Box, Button, Center, Image, Text } from '@chakra-ui/react'
import React from 'react'
import 'react-medium-image-zoom/dist/styles.css'
import {
  authorizedFetcher,
  useCragPhoto,
  useCurrentUser,
  useUser,
} from '../utils/backend'

export default function CragPhotoPage({ cragPhotoId }) {
  const { cragPhoto, error } = useCragPhoto(cragPhotoId)
  const { user } = useUser(cragPhoto?.user_id)
  const { user: currentUser } = useCurrentUser()

  const deleteImage = () =>
    authorizedFetcher(`/crag_photos/${cragPhotoId}}`, {
      method: 'DELETE',
    })

  if (cragPhoto === undefined || user === undefined) {
    return ''
  }

  if (error) {
    return <Text>Error fetching photo</Text>
  }
  return (
    <Box pb="10px">
      <Center mb="10px">
        <Text>Uploaded by: {user?.display_name}</Text>
        <Box ml="10px">
          {user?.id === currentUser.id ? (
            <Button onClick={deleteImage} size="xs">
              Delete
            </Button>
          ) : (
            ''
          )}
        </Box>
      </Center>
      <Center>
        <Image maxH="100vh" src={cragPhoto.base64_image} />
      </Center>
    </Box>
  )
}
