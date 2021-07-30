import {
  Container,
  Center,
  Heading,
  Link,
  LinkBox,
  Text,
  UnorderedList,
  ListItem,
  Button,
  Box,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import { useCrag, useSectors, mostVoted } from '../utils/backend.js'

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
      <Heading size="lg">
        {crag.name_votes.length >= 1
          ? mostVoted(crag.name_votes)
          : 'No name votes'}
        <LinkBox as={RouterLink} to={`/crags/${cragId}/vote-name`}>
          <Box as="sup">
            <EditButton />
            <VoteConflictWarning votes={crag.name_votes} />
          </Box>
        </LinkBox>
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
                <Text>{mostVoted(sector.name_votes)}</Text>
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
