import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  UnorderedList,
  OrderedList,
  ListItem,
  Button,
  VStack,
  HStack,
  Box,
  LinkBox,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import Grade from '../components/grade.js'
import LineImage from '../components/line-image.js'
import { SectorBreadcrumb } from '../components/breadcrumb.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import {
  useSector,
  useClimb,
  useClimbs,
  useImages,
  useLines,
  mostVoted,
} from '../utils/backend.js'

export default function Sector() {
  const { cragId, sectorId } = useParams()
  const { sector, error: errorSector } = useSector(sectorId)
  const { climbs, error: errorClimbs } = useClimbs({ sector_id: sectorId })
  const { lines, error: errorLines } = useLines({ sector_id: sectorId })
  const { images, error: errorImages } = useImages({ sector_id: sectorId })

  if (errorSector || errorClimbs || errorLines || errorImages) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load sector.</Text>
        </Center>
      </Container>
    )
  }

  if (
    sector === undefined ||
    climbs === undefined ||
    lines === undefined ||
    images === undefined
  ) {
    return <Loader />
  }

  const climbIdsWithLines = new Set(
    Object.values(lines).map((line) => line.climb_id)
  )

  return (
    <Container maxWidth="container.md">
      <SectorBreadcrumb sectorId={sectorId} />
      <Heading size="lg">
        {sector.name_votes.length >= 1
          ? mostVoted(sector.name_votes)
          : 'No name votes'}
        <LinkBox
          as={RouterLink}
          to={`/crags/${cragId}/sectors/${sectorId}/vote-name`}
        >
          <Box as="sup">
            <EditButton />
            <VoteConflictWarning votes={sector.name_votes} />
          </Box>
        </LinkBox>
      </Heading>
      {sector.coordinate_votes.length >= 1 && (
        <Heading size="xs">
          Position: {JSON.stringify(mostVoted(sector.coordinate_votes))}
        </Heading>
      )}
      {climbs.filter(
        (climb) =>
          climb.name_votes.length >= 1 && !climbIdsWithLines.has(climb.id)
      ).length >= 1 && (
        <>
          <Heading size="sm">Undrawn climbs</Heading>
          <UnorderedList>
            {climbs
              .filter(
                (climb) =>
                  climb.name_votes.length >= 1 &&
                  !climbIdsWithLines.has(climb.id)
              )
              .map((climb) => (
                <ListItem key={climb.id}>
                  <Link
                    as={RouterLink}
                    to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climb.id}`}
                  >
                    <HStack>
                      <Text>{mostVoted(climb.name_votes)}</Text>
                      {climb.grade_votes.length >= 1 && (
                        <Grade gradeId={mostVoted(climb.grade_votes)} />
                      )}
                    </HStack>
                  </Link>
                </ListItem>
              ))}
          </UnorderedList>
        </>
      )}
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/add-climb`}
      >
        <Button>Add climb</Button>
      </Link>
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/add-image`}
      >
        <Button>Add image</Button>
      </Link>
      <VStack>
        {images &&
          images.map((image) => (
            <ImageWithLines
              key={image.id}
              cragId={cragId}
              sectorId={sectorId}
              image={image}
            />
          ))}
      </VStack>
    </Container>
  )
}

function ImageWithLines({ cragId, sectorId, image }) {
  const { lines, error } = useLines({ image_id: image.id })

  if (error) {
    return (
      <Center>
        <Text margin="20px">Failed to load lines.</Text>
      </Center>
    )
  }

  if (lines === undefined) {
    return <Loader />
  }

  return (
    <Box padding="10px" border="1px" borderColor="gray.200" borderRadius="md">
      <LineImage image={image} lines={lines} />
      <OrderedList>
        {lines.map((line) => (
          <ListItem key={line.id}>
            <Climb
              cragId={cragId}
              sectorId={sectorId}
              climbId={line.climb_id}
            />
          </ListItem>
        ))}
      </OrderedList>
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}/add-line`}
      >
        <Button>Add line</Button>
      </Link>
    </Box>
  )
}

function Climb({ cragId, sectorId, climbId }) {
  const { climb, error } = useClimb(climbId)

  if (error) {
    return <Text margin="20px">Failed to load climb.</Text>
  }

  if (climb === undefined) {
    return <Loader />
  }

  return (
    <Link
      as={RouterLink}
      to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`}
    >
      <HStack>
        <Text>{mostVoted(climb.name_votes)}</Text>
        {climb.grade_votes.length >= 1 && (
          <Grade gradeId={mostVoted(climb.grade_votes)} />
        )}
        <VoteConflictWarning
          anyVotes={[
            climb.name_votes,
            climb.grade_votes,
            climb.line_path_votes,
          ]}
        />
      </HStack>
    </Link>
  )
}
