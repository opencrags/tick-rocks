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
  Flex,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Spacer,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  IconButton,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import Grade from '../components/grade.js'
import LineImage from '../components/line-image.js'
import { SectorBreadcrumb } from '../components/breadcrumb.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import {
  CragBanner,
  CragBannerMenu,
  CragBannerMenuButton,
} from '../components/crag-banner.js'
import { CalcDistance } from '../components/cordinate-distance-calc.js'

import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons'

import {
  useCrag,
  useSectors,
  useSector,
  useClimb,
  useClimbs,
  useImages,
  useLines,
  mostVoted,
} from '../utils/backend.js'
import { useState } from 'react'
import { PageFooter } from '../components/page-footer.js'

export default function Sector() {
  const { cragId, sectorId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { sectors, error: errorSectors } = useSectors({ crag_id: cragId }, 100)
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
    images === undefined ||
    sectors === undefined
  ) {
    return <Loader />
  }

  const climbIdsWithLines = new Set(
    Object.values(lines).map((line) => line.climb_id)
  )

  const nearbySectors = sectors.filter(
    (nearbySector) =>
      nearbySector.name_votes.length >= 1 &&
      nearbySector.coordinate_votes.length >= 1 &&
      sector.id != nearbySector.id
  )

  return (
    <Container bg="brand.100" maxWidth="100%" minHeight="95vh" padding="0px">
      <CragBanner cragId={cragId}>
        <SectorBreadcrumb sectorId={sectorId} />
        <Heading
          size="lg"
          fontFamily="sans-serif"
          fontWeight="bold"
          letterSpacing="tight"
          textShadow="2px 2px 2px rgba(0, 0, 0, 0.1)"
        >
          {sector.name_votes.length >= 1
            ? mostVoted(sector.name_votes)
            : 'No name votes'}
          <LinkBox
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sector.id}/vote-name`}
          >
            <Box as="sup">
              <EditButton />
              <VoteConflictWarning votes={sector.name_votes} />
            </Box>
          </LinkBox>
        </Heading>
        <Text size="sm">
          {sector.coordinate_votes.length >= 1
            ? `Coordinates: ${JSON.stringify(
                mostVoted(sector.coordinate_votes).coordinates
              )}`
            : 'No coordinate votes'}
          <LinkBox
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sector.id}/vote-coordinates`}
          >
            <Box as="sup">
              <EditButton />
              <VoteConflictWarning votes={sector.coordinate_votes} />
            </Box>
          </LinkBox>
        </Text>
      </CragBanner>
      <CragBannerMenu>
        <Menu>
          <MenuButton
            padding="8px"
            variant="unstyled"
            fontWeight="normal"
            fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
            letterSpacing="1.5pt"
            _hover={{ color: 'brand.200' }}
            transition="all .1s"
          >
            <Center>
              <Text display={{ base: 'none', sm: 'block' }}>
                Edit <ChevronDownIcon />
              </Text>
              <EditIcon display={{ base: 'block', sm: 'none' }} />{' '}
            </Center>
          </MenuButton>
          <MenuList>
            <MenuItem
              as={RouterLink}
              to={`/crags/${cragId}/sectors/${sector.id}/add-climb`}
            >
              Add Climb
            </MenuItem>
            <MenuItem
              as={RouterLink}
              to={`/crags/${cragId}/sectors/${sector.id}/add-image`}
            >
              Add image
            </MenuItem>
          </MenuList>
        </Menu>
      </CragBannerMenu>

      <Flex display={{ base: 'wrap', md: 'flex' }} justify="space-between">
        <Box flex="0 0 10%" flexGrow="0">
          {sector.coordinate_votes.length >= 1 && nearbySectors.length >= 2 && (
            <Box
              display={{ base: 'none', xl: 'block' }}
              position="sticky"
              top="40px"
              maxWidth="10vw"
            >
              <Box color="black" padding="10px" w="300px">
                <Heading
                  mb="10px"
                  size="md"
                  color="white"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  letterSpacing="tighter"
                  textShadow="2px 2px 2px rgba(0, 0, 0, 0.1)"
                >
                  Close by:
                </Heading>
                <Box fontSize="sm" bgColor="gray.500">
                  {nearbySectors.map((nearbySector) => (
                    <Box
                      key={sector.id}
                      as={RouterLink}
                      to={`/crags/${cragId}/sectors/${nearbySector.id}`}
                    >
                      <Box padding="10px">
                        <CalcDistance
                          lat1={
                            mostVoted(sector.coordinate_votes).coordinates[1]
                          }
                          lon1={
                            mostVoted(sector.coordinate_votes).coordinates[0]
                          }
                          lat2={
                            mostVoted(nearbySector.coordinate_votes)
                              .coordinates[1]
                          }
                          lon2={
                            mostVoted(nearbySector.coordinate_votes)
                              .coordinates[0]
                          }
                        />
                        <Text>{mostVoted(nearbySector.name_votes)}</Text>
                        <VoteConflictWarning
                          anyVotes={[
                            nearbySector.name_votes,
                            nearbySector.coordinate_votes,
                          ]}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Flex direction="column">
          <Box mt={1}>
            {climbs.filter(
              (climb) =>
                climb.name_votes.length >= 1 && !climbIdsWithLines.has(climb.id)
            ).length >= 1 && (
              <>
                <Alert status="warning">
                  <Flex direction="column">
                    <Flex direction="row">
                      <AlertIcon />
                      <AlertTitle mr={2}>
                        There are undrawn lines on this sector.
                      </AlertTitle>
                      <AlertDescription>
                        Please edit and add topo to contribute.
                      </AlertDescription>
                    </Flex>
                    <AlertDescription ml={{ base: 0, lg: 10 }}>
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
                                to={`/crags/${cragId}/sectors/${sector.id}/climbs/${climb.id}`}
                              >
                                <Flex>
                                  <Text overflowWrap="anywhere">
                                    {mostVoted(climb.name_votes)}
                                  </Text>
                                  {climb.grade_votes.length >= 1 && (
                                    <Grade
                                      gradeId={mostVoted(climb.grade_votes)}
                                    />
                                  )}
                                </Flex>
                              </Link>
                            </ListItem>
                          ))}
                      </UnorderedList>
                    </AlertDescription>
                  </Flex>
                </Alert>
              </>
            )}
          </Box>
          <Box margin="0px" flex="0 0 80%" flexGrow="5">
            {images &&
              images.map((image) => (
                <ImageWithLines
                  pictureNumber={'1'}
                  pictureTotalNumber={'2'}
                  key={image.id}
                  cragId={cragId}
                  sectorId={sectorId}
                  sectorName={mostVoted(sector.name_votes)}
                  image={image}
                />
              ))}
          </Box>
        </Flex>
        <Box flex="0 0 10%" flexGrow="0">
          <Box maxWidth="20vw"></Box>
        </Box>
      </Flex>
      <PageFooter></PageFooter>
    </Container>
  )
}

function ImageWithLines({
  cragId,
  sectorId,
  image,
  sectorName,
  pictureNumber,
  pictureTotalNumber,
}) {
  const [selectedIndex, setSelectedIndex] = useState(null)

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
  const parsedLines = lines.map((line) => mostVoted(line.line_path_votes))

  const handleMouseMove = (event) => {
    const canvas = event.target
    const bounds = canvas.getBoundingClientRect()
    const mouseX = event.pageX - bounds.left - window.scrollX
    const mouseY = event.pageY - bounds.top - window.scrollY

    let hasSelected = false
    parsedLines.forEach((points, index) => {
      const { x, y } = {
        x: points[0].x * canvas.width,
        y: points[0].y * canvas.height,
      }
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2)
      if (distance < 12) {
        setSelectedIndex(index)
        hasSelected = true
      }
    })
    if (!hasSelected && selectedIndex !== null) {
      setSelectedIndex(null)
    }
  }

  return (
    <Box pt={{ base: '0px', md: '2' }}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        bg="gray.300"
        boxShadow="xl"
      >
        <Box alignSelf="baseline">
          <LineImage
            as={LineImage}
            image={image}
            lines={lines}
            selectedIndex={selectedIndex}
            onMouseMove={handleMouseMove}
          />
        </Box>
        <Box>
          <Flex
            direction="column"
            pl={{ base: '10px', md: '0px' }}
            pr={{ base: '10px', md: '0px' }}
          >
            <Flex justify="space-between" alignItems="center">
              <Box>
                <Text size="sm">
                  {sectorName} ({pictureNumber}/{pictureTotalNumber})
                </Text>
              </Box>
              <Spacer />
              <Box>
                <IconButton
                  colorScheme="green"
                  as={RouterLink}
                  to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}/add-line`}
                  size="sm"
                  icon={<EditIcon />}
                />
              </Box>
            </Flex>
            <Box>
              <Box
                overflow="auto"
                minHeight="100px"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '10px',
                    borderRadius: '8px',
                    backgroundColor: `white`,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: `gray.300`,
                    borderRadius: '8px',
                  },
                }}
              >
                <OrderedList
                  pr="10px"
                  pl="10px"
                  pt="2px"
                  wordBreak="noraml"
                  whitespace="normal"
                >
                  {lines.map((line, index) => (
                    <ListItem
                      key={line.id}
                      bg={index === selectedIndex ? 'whiteAlpha.600' : ''}
                      onMouseOver={() => setSelectedIndex(index)}
                    >
                      <Climb
                        cragId={cragId}
                        sectorId={sectorId}
                        climbId={line.climb_id}
                      />
                    </ListItem>
                  ))}
                </OrderedList>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
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
