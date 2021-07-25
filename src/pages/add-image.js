import {
  Container,
  Center,
  Heading,
  Box,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import Dropzone from 'react-dropzone'
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useCrag, useSector, useAuthorizedFetcher } from '../utils/backend.js'

export default function AddImage() {
  const { cragId, sectorId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sector, error: errorSector } = useSector(sectorId)
  const history = useHistory()
  const { authorizedFetcher, isLoading, error } = useAuthorizedFetcher()

  const addImage = (base64Image) =>
    authorizedFetcher('/images', {
      method: 'POST',
      body: JSON.stringify({
        sector_id: sectorId,
        base64_image: base64Image,
      }),
    })

  const navigateToSector = () =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}`)

  const navigateToAddedImage = (imageId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/images/${imageId}`)

  const onDropImages = (files) => {
    Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onabort = () => reject('File reading was aborted')
          reader.onerror = () => reject('File reading has failed')
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        }).then(addImage)
      )
    )
      .then((images) =>
        images.length >= 2
          ? navigateToSector()
          : navigateToAddedImage(images[0].id)
      )
      .catch(console.error)
  }

  if (error || errorCrag || errorSector) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
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

  if (
    (!authorizedFetcher && isLoading) ||
    crag === undefined ||
    sector === undefined
  ) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/crags/${cragId}`}>
            {crag.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}`}
          >
            {sector.name_votes[0].value}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Text>Add image</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading>Add image</Heading>
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
