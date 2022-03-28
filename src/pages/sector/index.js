import { useColorModeValue } from '@chakra-ui/color-mode'
import { AddIcon, ChevronDownIcon, EditIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  LinkBox,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  OrderedList,
  Stack,
  Text,
  UnorderedList,
  Spacer,
} from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { SectorBreadcrumb } from '../../components/breadcrumb.js'
import { CalcDistance } from '../../components/cordinate-distance-calc.js'
import { CragBanner, CragBannerMenu } from '../../components/crag-banner.js'
import EditButton from '../../components/edit-button.js'
import Grade from '../../components/grade.js'
import LineImage from '../../components/line-image.js'
import Loader from '../../components/loader.js'
import ModalDialog from '../../components/modal-dialog.js'
import { PageFooter } from '../../components/page-footer.js'
import VoteConflictWarning from '../../components/vote-conflict-warning.js'
import {
  mostVoted,
  useClimbs,
  useImages,
  useLines,
  useSector,
  useSectors,
} from '../../utils/backend.js'
import AddClimb from '../add-climb.js'
import AddImage from '../add-image.js'
import { Comments } from '../comments.js'
import { Climb } from './climb.js'

export default function Sector() {
  const bg = useColorModeValue('gray.100', 'gray.700')
  const boxBg = useColorModeValue('offwhite', 'gray.800')

  const headingShadow = '3px 3px 3px rgba(0, 0, 0, 0.2)'
  const { cragId, sectorId } = useParams()
  const { sectors, error: errorSectors } = useSectors({ crag_id: cragId }, 100)
  const { sector, error: errorSector } = useSector(sectorId)
  const { climbs, error: errorClimbs } = useClimbs({ sector_id: sectorId })
  const { lines, error: errorLines } = useLines({ sector_id: sectorId })
  const { images, error: errorImages } = useImages({ sector_id: sectorId })

  if (errorSector || errorClimbs || errorLines || errorImages || errorSectors) {
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
      sector.id !== nearbySector.id
  )

  return (
    <Flex direction="column" height="95vh">
      <Container bg={bg} maxWidth="100%" flexGrow="1" padding="0px">
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
              color="white"
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
              <ModalDialog button={<MenuItem>Add topo image</MenuItem>}>
                <AddImage />
              </ModalDialog>
              <ModalDialog button={<MenuItem>Add climb</MenuItem>}>
                <AddClimb />
              </ModalDialog>
              <ModalDialog button={<MenuItem>Rearrange topos</MenuItem>}>
                <AddImage />
              </ModalDialog>
            </MenuList>
          </Menu>
        </CragBannerMenu>

        <Center>
          <Stack direction="row" align="center">
            <Box mx="5px">
              <ModalDialog
                button={
                  <Box>
                    <IconButton
                      icon={<AddIcon />}
                      display={{ base: 'block', md: 'none' }}
                      boxShadow="xl"
                      colorScheme="brand"
                      color="white"
                    ></IconButton>
                    <Button
                      display={{ base: 'none', md: 'block' }}
                      boxShadow="xl"
                      pr={4}
                      pl={4}
                      colorScheme="brand"
                      color="white"
                    >
                      <Flex align="center" direction="row">
                        <AddIcon /> <Text ml="5px">Add topo image</Text>
                      </Flex>
                    </Button>
                  </Box>
                }
              >
                <AddImage />
              </ModalDialog>
            </Box>
            <Box mx="5px">
              <ModalDialog
                button={
                  <Box>
                    <IconButton
                      icon={<AddIcon />}
                      display={{ base: 'block', md: 'none' }}
                      boxShadow="xl"
                      colorScheme="brand"
                      color="white"
                    ></IconButton>
                    <Button
                      display={{ base: 'none', md: 'block' }}
                      boxShadow="xl"
                      pr={4}
                      pl={4}
                      colorScheme="brand"
                      color="white"
                    >
                      <Flex align="center" direction="row">
                        <AddIcon /> <Text ml="5px">Add climb</Text>
                      </Flex>
                    </Button>
                  </Box>
                }
              >
                <AddClimb />
              </ModalDialog>
            </Box>
          </Stack>
        </Center>

        <Flex display={{ base: 'wrap', md: 'flex' }} justify="Center">
          <Flex direction="column" mb="10px">
            <Box>
              {images &&
                images.map((image) => (
                  <ImageWithLines
                    key={image.id}
                    cragId={cragId}
                    sectorId={sectorId}
                    sectorName={mostVoted(sector.name_votes)}
                    image={image}
                  />
                ))}
            </Box>
            <Box mt={1}>
              {climbs.filter(
                (climb) =>
                  climb.name_votes.length >= 1 &&
                  !climbIdsWithLines.has(climb.id)
              ).length >= 1 && (
                <>
                  <Alert status="warning" colorScheme="red">
                    <Flex direction="column" w="100%">
                      <Flex direction="row" w="100%">
                        <AlertIcon />
                        <AlertTitle mr={2} w="100%">
                          <Flex
                            display={{ base: 'wrap', md: 'flex' }}
                            justify="space-between"
                          >
                            <Box>
                              There are undrawn lines on this sector.
                              <Text fontWeight="normal">
                                Please edit and add topo to contribute.
                              </Text>
                            </Box>
                          </Flex>
                        </AlertTitle>
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
                                    &nbsp;
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
            <Flex justify="center">
              <Box w="100%" maxW="880px" px="10px">
                <Box mt="20px">
                  <Box pl="10px" pb="10px">
                    <Heading fontSize={{ base: 'md', md: 'xl' }} mb="10px">
                      Comments
                    </Heading>
                    <Comments relatedId={sector.id} />
                  </Box>
                </Box>
              </Box>
            </Flex>
          </Flex>
          <Box>
            {sector.coordinate_votes.length >= 1 && nearbySectors.length >= 2 && (
              <Box
                padding="10px"
                display={{ base: 'wrap', xl: 'block' }}
                position="sticky"
                top="65px"
                bgColor={boxBg}
                w="100%"
                margin={{ base: '0px', md: '10px' }}
                minW="200px"
              >
                <Box>
                  <Heading
                    mb="10px"
                    size="md"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    letterSpacing="tighter"
                    textShadow={headingShadow}
                  >
                    Sectors close by:
                  </Heading>
                  <Box fontSize="sm">
                    {nearbySectors.map((nearbySector) => (
                      <Box
                        key={sector.id}
                        as={RouterLink}
                        to={`/crags/${cragId}/sectors/${nearbySector.id}`}
                      >
                        <HStack padding="10px">
                          <Text>{mostVoted(nearbySector.name_votes)}</Text>
                          <VoteConflictWarning
                            anyVotes={[
                              nearbySector.name_votes,
                              nearbySector.coordinate_votes,
                            ]}
                          />
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
                        </HStack>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Flex>
      </Container>
      <PageFooter></PageFooter>
    </Flex>
  )
}

function ImageWithLines({ cragId, sectorId, image, sectorName }) {
  const boxBg = useColorModeValue('gray.300', 'gray.600')
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

  if (lines === isEmpty()) {
    return <Box>Emptiiii</Box>
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
    <Box py="5px">
      <Flex direction="column">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          bg={boxBg}
          boxShadow="xl"
        >
          <Box alignSelf="baseline">
            <LineImage
              image={image}
              lines={lines}
              selectedIndex={selectedIndex}
              onMouseMove={handleMouseMove}
            />
          </Box>
          <Box flexGrow="1" margin="10px 0">
            <Flex direction="column">
              <Flex
                px="8px"
                py="5px"
                justify="space-between"
                alignItems="center"
              >
                <Box>
                  <Text size="sm">Sector: {sectorName}</Text>
                </Box>
                <Spacer />
                <Box>
                  <Menu>
                    <MenuButton
                      px={2}
                      py={1}
                      transition="all 0.2s"
                      borderRadius="md"
                      borderWidth="1px"
                      _hover={{ bg: 'gray.400' }}
                      _expanded={{ bg: 'brand.300' }}
                      _focus={{ boxShadow: 'outline' }}
                    >
                      Edit <ChevronDownIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        as={RouterLink}
                        to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}/add-line`}
                      >
                        Draw line
                      </MenuItem>

                      <MenuItem
                        as={RouterLink}
                        to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}/add-line`}
                      >
                        Rearrange climbs
                      </MenuItem>

                      <MenuItem
                        as={RouterLink}
                        to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}/add-line`}
                      >
                        Delete topo image
                      </MenuItem>
                    </MenuList>
                  </Menu>
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
                    pr="15px"
                    pl="10px"
                    pt="2px"
                    pb="5px"
                    wordBreak="noraml"
                    whitespace="normal"
                  >
                    {lines.map((line, index) => (
                      <ListItem
                        key={line.id}
                        bg={index === selectedIndex ? { boxBg } : ''}
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
      </Flex>
    </Box>
  )
}
