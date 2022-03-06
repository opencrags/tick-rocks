import { useColorModeValue } from '@chakra-ui/color-mode'
import { AddIcon, ChevronDownIcon, EditIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  CloseButton,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  LinkBox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Tag,
  Text,
  Wrap,
} from '@chakra-ui/react'
import Linkify from 'react-linkify'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  CragBannerMenu,
  CragFrontPageBanner,
} from '../components/crag-banner.js'
import { CragComponentBox } from '../components/crag-component-box'
import { CragGrades } from '../components/crag-grades.js'
import EditButton from '../components/edit-button.js'
import Loader from '../components/loader.js'
import ModalDialog from '../components/modal-dialog.js'
import { PageFooter } from '../components/page-footer.js'
import { PhotoGrid } from '../components/photo-grid.js'
import { Sector, SectorGrid } from '../components/sectors.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import {
  countVotes,
  mostVoted,
  useCrag,
  useCragPhotos,
  useSectors,
} from '../utils/backend.js'
import AddCragPhoto from './add-crag-photo.js'
import AddSector from './add-sector.js'
import Comments from './comments.js'

export default function Crag() {
  const bg = useColorModeValue('gray.200', 'gray.700')
  const boxBg = useColorModeValue('offwhite', 'gray.600')
  const headingColor = useColorModeValue('gray.900', 'gray.100')
  const headingShadow = useColorModeValue(
    'none',
    '3px 3px 3px rgba(0, 0, 0, 0.2)'
  )

  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { cragPhotos, error: errorCragPhotos } = useCragPhotos({
    crag_id: cragId,
  })
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
    <Container bg={bg} padding="0px" maxWidth="100%">
      <CragFrontPageBanner cragId={cragId}>
        <Box position="absolute">
          <Heading
            textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
            fontSize={{
              base: '20pt',
              xs: '30pt',
              sm: '40pt',
              md: '50pt',
              lg: '55pt',
            }}
            fontFamily="sans-serif"
            fontWeight="bold"
            letterSpacing="tighter"
          >
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
          <Box ml="10px">
            <Text
              textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
              fontSize={{ base: '8pt', sm: '12pt', md: '14pt', lg: '18pt' }}
              fontWeight="hairline"
              fontFamily="sans-serif"
              letterSpacing="tight"
              color="gray.300"
            >
              in the area of{' '}
              <Link color="white" as={RouterLink} to="/areas">
                Uppsala, Sweden
              </Link>
            </Text>
            <Wrap spacing={2}>
              <Tag size="md" h={9} borderRadius="full" colorScheme="yellow">
                193 Boulders
              </Tag>
              <Tag size="md" h={9} borderRadius="full" colorScheme="orange">
                The Watchtower 7C
              </Tag>
              <Tag size="md" h={9} borderRadius="full" colorScheme="blue">
                Close to lake
              </Tag>
              <Tag size="md" h={9} borderRadius="full" colorScheme="green">
                {'< 5 min approach'}
              </Tag>
              <Tag size="md" h={9} borderRadius="full" colorScheme="red">
                ★★★★★ Granite
              </Tag>
            </Wrap>
          </Box>
        </Box>
      </CragFrontPageBanner>
      <Box position="sticky" bottom="55px" zIndex="1">
        {countVotes(crag?.access_information_votes)
          .filter((vote) => vote.count > 1)
          .map((vote) => (
            <Box key={vote.id}>
              <Alert status="warning" variant="solid">
                <AlertIcon />
                <AlertTitle>Access Issue!</AlertTitle>
                {vote.value} ({vote.count} votes)
              </Alert>
            </Box>
          ))}

        <Alert status="info" variant="solid">
          <AlertIcon />
          <AlertTitle>New comment!</AlertTitle>
          Rasmus: Kul och så men va i hela jäv... View now
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      </Box>
      <CragBannerMenu>
        <Menu>
          <MenuButton
            color="white"
            _hover={{ textColor: 'brand.200' }}
            padding="8px"
          >
            <Center>
              <Text
                display={{ base: 'none', sm: 'block' }}
                fontWeight="normal"
                fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
                letterSpacing="1.5pt"
              >
                Edit <ChevronDownIcon />
              </Text>
              <EditIcon display={{ base: 'block', sm: 'none' }} />
            </Center>
          </MenuButton>
          <MenuList zIndex="popover">
            <ModalDialog button={<MenuItem>Add Sector</MenuItem>}>
              <AddSector />
            </ModalDialog>
            <ModalDialog button={<MenuItem>Add Photo</MenuItem>}>
              <AddCragPhoto />
            </ModalDialog>
          </MenuList>
        </Menu>
      </CragBannerMenu>
      <Box>
        <CragComponentBox>
          <Flex
            justify="space-between"
            direction={{ base: 'column', xl: 'row' }}
            margin="0px"
          >
            <Box id="cragDescription" mt="5px" mb="5px" mr="5px" flex="0 0 60%">
              <Heading
                color={headingColor}
                textShadow={headingShadow}
                padding="10px"
                size="xl"
                fontFamily="sans-serif"
                fontWeight="bold"
                letterSpacing="tighter"
              >
                Description
                <LinkBox
                  as={RouterLink}
                  to={`/crags/${cragId}/vote-crag-description`}
                >
                  <Box as="sup">
                    <EditButton />
                    <VoteConflictWarning votes={crag.description_votes} />
                  </Box>
                </LinkBox>
              </Heading>
              <Box pl="10px" pr="10px" pb="10px" w="100%">
                <Text>
                  <Linkify overflowWrap="break-word">
                    {crag.description_votes.length === 0
                      ? 'No description has been added.'
                      : mostVoted(crag.description_votes)}
                  </Linkify>
                </Text>
              </Box>
            </Box>

            <Wrap id="cragAccess" mt="5px" mb="5px" mr="5px">
              <Box>
                <Heading
                  color={headingColor}
                  textShadow={headingShadow}
                  padding="10px"
                  size="xl"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  letterSpacing="tighter"
                >
                  Access
                  <LinkBox
                    as={RouterLink}
                    to={`/crags/${cragId}/vote-access-information`}
                  >
                    <Box as="sup">
                      <EditButton />
                      <VoteConflictWarning
                        votes={crag.access_information_votes}
                      />
                    </Box>
                  </LinkBox>
                </Heading>
                <Box pl="10px" pr="10px" pb="10px" w="100%">
                  <Text>
                    <Linkify overflowWrap="break-word">
                      {crag.access_information_votes.length === 0
                        ? 'No access information has been added.'
                        : mostVoted(crag.access_information_votes)}
                    </Linkify>
                  </Text>
                </Box>
              </Box>
              <Box as={RouterLink} to="/authors" margin="5px" flex="0 0 10%">
                <Heading
                  color={headingColor}
                  textShadow={headingShadow}
                  padding="10px"
                  size="xl"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  letterSpacing="tighter"
                >
                  Authors
                </Heading>
                <Box pl="10px" pb="10px">
                  <AvatarGroup overflow="auto" size="md" max={2}>
                    <Avatar name="Åke R" />
                    <Avatar name="Richard L" />
                    <Avatar name="Rasmus E" />
                  </AvatarGroup>
                </Box>
              </Box>
            </Wrap>
          </Flex>
        </CragComponentBox>
        <CragComponentBox>
          <CragGrades />
        </CragComponentBox>
        <Flex
          position="sticky"
          top="98px"
          bottom={{ base: 'none', md: '0px' }}
          justify="center"
          display={{ base: 'wrap', md: 'flex' }}
          padding="10px"
          zIndex="2"
        >
          <LinkBox as={RouterLink} to={`/crags/${cragId}/list`}>
            <Button
              boxShadow="xl"
              pr={8}
              pl={8}
              m={2}
              colorScheme="brand"
              color="white"
            >
              List all problems
            </Button>
          </LinkBox>
          <Button boxShadow="xl" pr={8} pl={8} m={2} colorScheme="gray">
            View topo
          </Button>
          <Button boxShadow="xl" pr={8} pl={8} m={2} colorScheme="gray">
            View map
          </Button>
        </Flex>
      </Box>
      <CragComponentBox bg={boxBg}>
        <Box mt="5px" pb="5px">
          <Box
            zIndex="2"
            position={{ base: 'initial', md: 'sticky' }}
            top={{ base: '50px', md: '102px' }}
            bottom="0px"
            padding="10px"
          >
            <Flex flexWrap="wrap">
              <Heading
                color={headingColor}
                size="2xl"
                fontFamily="sans-serif"
                fontWeight="bold"
                letterSpacing="tighter"
                textShadow={headingShadow}
              >
                Sectors
              </Heading>
              <Spacer />

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
                            <AddIcon /> <Text ml="5px">New sector </Text>
                          </Flex>
                        </Button>
                      </Box>
                    }
                  >
                    <AddSector />
                  </ModalDialog>
                </Box>
                <Box>
                  <Button boxShadow="xl" pr={4} pl={4} colorScheme="gray">
                    List All
                  </Button>
                </Box>
              </Stack>
            </Flex>
          </Box>

          <Box pb="10px">
            {sectors.length > 0 ? (
              <SectorGrid sectors={sectors}>
                {sectors
                  .filter((sector) => sector.name_votes.length >= 1 && sector)
                  .map((sector) => (
                    <Sector
                      key={sector.id}
                      cragId={crag.id}
                      sectorId={sector.id}
                    >
                      <Text>{mostVoted(sector.name_votes)}</Text>
                      <VoteConflictWarning
                        anyVotes={[sector.name_votes, sector.coordinate_votes]}
                      />
                    </Sector>
                  ))}
              </SectorGrid>
            ) : (
              <Center> No sectors has been added yet.</Center>
            )}
          </Box>
        </Box>
      </CragComponentBox>
      <CragComponentBox>
        <Box mt="10px" pb="5px">
          <Flex>
            <Heading
              color={headingColor}
              flex="1"
              size="2xl"
              fontFamily="sans-serif"
              fontWeight="bold"
              letterSpacing="tighter"
              padding="10px"
              textShadow={headingShadow}
            >
              Recent comments
            </Heading>
            <Spacer />

            <Stack direction="row" align="center">
              <Box mx="5px">
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
                      <AddIcon /> <Text ml="5px">Add comment</Text>
                    </Flex>
                  </Button>
                </Box>
              </Box>
              <Box>
                <Button boxShadow="xl" pr={4} pl={4} colorScheme="gray">
                  View All
                </Button>
              </Box>
            </Stack>
          </Flex>
          <Box>
            <Comments relatedId={cragId} wrap={true} />
          </Box>
        </Box>
      </CragComponentBox>
      <CragComponentBox>
        <Box className="photos">
          <Box
            position={{ base: 'initial', md: 'sticky' }}
            top={{ base: '55px', md: '105' }}
            mt="10px"
            mb="5px"
            zIndex="2"
          >
            <Box mt="10px" mb="5px">
              <Flex>
                <Heading
                  color={headingColor}
                  flex="1"
                  size="2xl"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  letterSpacing="tighter"
                  padding="10px"
                  textShadow={headingShadow}
                >
                  Photos of{' '}
                  {crag.name_votes.length >= 1
                    ? mostVoted(crag.name_votes)
                    : 'No name votes'}
                </Heading>
                <Stack direction="row" align="center">
                  <Box mx="10px">
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
                              <AddIcon /> <Text ml="5px">Add image</Text>
                            </Flex>
                          </Button>
                        </Box>
                      }
                    >
                      <AddCragPhoto />
                    </ModalDialog>
                  </Box>
                </Stack>
              </Flex>
            </Box>
          </Box>
          <PhotoGrid cragPhotos={cragPhotos} error={errorCragPhotos} />
        </Box>
      </CragComponentBox>
      <PageFooter></PageFooter>
    </Container>
  )
}
