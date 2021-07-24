import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  UnorderedList,
  ListItem,
  Button,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import { useCrag, useSectors } from '../utils/backend.js'

export default function Crag() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sectors, error: errorSectors } = useSectors({ crag_id: cragId }, 100)

  if (errorCrag || errorSectors) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load crag.</Text>
        </Center>
      </Container>
    )
  }

  if (crag === undefined || sectors === undefined) {
    return <Loader />
  }

  return (
    <Container maxWidth="container.md">
      <Heading size="xl" marginTop="20px">
        {crag.name_votes[0].value}
        <EditButton to={`/crags/${crag.id}/vote-name`} />
      </Heading>
      <Heading size="sm">Sectors</Heading>
      <UnorderedList>
        {sectors
          .filter((sector) => sector.name_votes.length >= 1)
          .map((sector) => (
            <ListItem key={sector.id}>
              <Link
                as={RouterLink}
                to={`/crags/${crag.id}/sectors/${sector.id}`}
              >
                <Text>{sector.name_votes[0].value}</Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
      <Link as={RouterLink} to={`/crags/${crag.id}/add-sector`}>
        <Button>Add sector</Button>
      </Link>
    </Container>
  )
}
