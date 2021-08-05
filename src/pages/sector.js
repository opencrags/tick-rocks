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
import { CragComponentBox } from '../components/crag-component-box'

import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons'

import {
  useSector,
  useClimb,
  useClimbs,
  useImages,
  useLines,
  mostVoted,
} from '../utils/backend.js'
import { useState } from 'react'

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
    <Container bg="brand.100" maxWidth="100%" padding="0px">
      <CragBanner cragBannerImage="https://27crags.s3.amazonaws.com/photos/000/213/213830/size_xl-9d8dc766475a.jpg">
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
        <Text size="sm">
          {sector.coordinate_votes.length >= 1
            ? `Coordinates: ${JSON.stringify(
                mostVoted(sector.coordinate_votes).coordinates
              )}`
            : 'No coordinate votes'}
          <LinkBox
            as={RouterLink}
            to={`/crags/${cragId}/sectors/${sectorId}/vote-coordinates`}
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
          <MenuButton padding="8px">
            <Center>
              <Text
                fontSize={{ base: 'xs', sm: 'sm' }}
                display={{ base: 'none', sm: 'block' }}
              >
                Edit <ChevronDownIcon />
              </Text>{' '}
              <EditIcon display={{ base: 'block', sm: 'none' }} />{' '}
            </Center>
          </MenuButton>
          <MenuList>
            <MenuItem
              as={RouterLink}
              to={`/crags/${cragId}/sectors/${sectorId}/add-climb`}
            >
              Add Climb
            </MenuItem>
            <MenuItem
              as={RouterLink}
              to={`/crags/${cragId}/sectors/${sectorId}/add-image`}
            >
              Add image
            </MenuItem>
          </MenuList>
        </Menu>
      </CragBannerMenu>
      <CragComponentBox>
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
      </CragComponentBox>

      <VStack>
        <CragComponentBox>
          {images &&
            images.map((image) => (
              <ImageWithLines
                key={image.id}
                cragId={cragId}
                sectorId={sectorId}
                image={image}
              />
            ))}
        </CragComponentBox>
      </VStack>
    </Container>
  )
}

function ImageWithLines({ cragId, sectorId, image }) {
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
    <Box
      padding={{ base: '0px', md: '10px' }}
      bg="gray.500"
      pl={{ base: '0px', md: '5vw' }}
      pr={{ base: '0px', md: '5vw' }}
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Box alignSelf="baseline">
          <Center>
            <LineImage
              as={LineImage}
              image={image}
              lines={lines}
              selectedIndex={selectedIndex}
              onMouseMove={handleMouseMove}
            />
          </Center>
        </Box>
        <Flex
          direction="column"
          minW="30%"
          pl={{ base: '10px', md: '0px' }}
          pr={{ base: '10px', md: '0px' }}
        >
          <Flex
            padding="10px"
            ml={{ base: '0px', md: '10px' }}
            justify="space-between"
            borderBottom="1px"
            borderColor="gray.400"
          >
            <Box>
              <Text size="sm">{sectorId.name_votes} </Text>
            </Box>
            <Box>
              <Button
                variant="unstyled"
                as={RouterLink}
                to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}/add-line`}
                size="sm"
              >
                Add line
              </Button>
            </Box>
          </Flex>
          <Box>
            <Box
              overflow="auto"
              height={{ base: '50vh', md: '80vh' }}
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
              <OrderedList pr="10px" pl="10px" pt="2px">
                {lines.map((line, index) => (
                  <ListItem
                    key={line.id}
                    bg={index === selectedIndex ? 'gray.300' : ''}
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
