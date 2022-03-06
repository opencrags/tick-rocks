import { Box, Center, Container, Heading, Text } from '@chakra-ui/react'
import Dropzone from 'react-dropzone'
import { useHistory, useParams } from 'react-router-dom'
import { CragBreadcrumb } from '../components/breadcrumb.js'
import Loader from '../components/loader.js'
import { useAuthorizedFetcher } from '../utils/backend.js'

export default function AddCragPhoto() {
  const { cragId } = useParams()
  const history = useHistory()
  const {
    authorizedFetcher,
    isLoading,
    error: fetcherError,
  } = useAuthorizedFetcher()

  const addCragPhoto = (base64Image) =>
    authorizedFetcher('/crag_photos', {
      method: 'POST',
      body: JSON.stringify({
        crag_id: cragId,
        base64_image: base64Image,
      }),
    })

  const navigateToCrag = () => history.replace(`/crags/${cragId}`)

  const onDropImages = (files) => {
    Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onabort = () => reject('File reading was aborted')
          reader.onerror = () => reject('File reading has failed')
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        }).then(addCragPhoto)
      )
    )
      .then(navigateToCrag)
      .catch(console.error)
  }

  if (fetcherError) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load page.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && !isLoading) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">You need to login to add stuff and vote.</Text>
        </Center>
      </Container>
    )
  }

  if (!authorizedFetcher && isLoading) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <CragBreadcrumb cragId={cragId} extra={[{ text: 'Add crag photo' }]} />
      <Heading>Add crag photo</Heading>
      <Dropzone accept={['image/jpeg']} onDrop={onDropImages}>
        {({ getRootProps, getInputProps }) => (
          <Box
            border="1px dashed"
            borderColor="brand.200"
            padding="20px"
            marginTop="10px"
          >
            <Center {...getRootProps()}>
              <input {...getInputProps()} />
              <Text>
                Drag and drop images here or click to select (only jpeg allowed)
              </Text>
            </Center>
          </Box>
        )}
      </Dropzone>
    </Container>
  )
}
