import {
  Container,
  Center,
  Heading,
  LinkBox,
  Text,
  Button,
  Box,
  Flex,
  AvatarGroup,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Link,
  Spacer,
  IconButton,
  Grid,
  Wrap,
  Alert,
  AlertIcon,
  CloseButton,
  AlertTitle,
} from '@chakra-ui/react'
import Linkify from 'react-linkify'

import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import {
  useCrag,
  useSectors,
  mostVoted,
  useCragPhotos,
} from '../utils/backend.js'
import {
  CragFrontPageBannerMenu,
  CragFrontPageBanner,
  CragBannerMenu,
} from '../components/crag-banner.js'
import { CragPhotoGrid } from '../components/crag-photo-grid.js'
import { CragComponentBox } from '../components/crag-component-box'
import { CragSectorGrid, CragSector } from '../components/crag-sectors.js'
import { CragGrades } from '../components/crag-grades.js'
import { ChevronDownIcon, EditIcon, AddIcon } from '@chakra-ui/icons'
import { PageFooter } from '../components/page-footer.js'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import ModalDialog from '../components/modal-dialog.js'
import AddSector from './add-sector.js'
import AddCragPhoto from './add-crag-photo.js'
import Comments from './comments.js'
export default function Crag() {
  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.100', 'gray.600')
  const buttonBg = useColorModeValue('gray.200', 'gray.600')
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
          <Text
            ml="20px"
            textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
            fontSize={{ base: '8pt', sm: '12pt', md: '14pt', lg: '18pt' }}
            fontWeight="hairline"
            fontFamily="sans-serif"
            letterSpacing="tight"
            color="gray.300"
          >
            in the area of{' '}
            <Link color="white" as={RouterLink} to="/">
              Fontaniebleau, France
            </Link>
          </Text>
        </Box>
      </CragFrontPageBanner>
      <Box position="sticky" bottom="55px" zIndex="1">
        <Alert status="warning" variant="solid">
          <AlertIcon />
          <AlertTitle>Access Issue!</AlertTitle>
          Climbing is prohibited during May-July due to birds. Kraa-kraaa!
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
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
                  <Avatar
                    name="Åke R"
                    src="https://scontent.fbma2-1.fna.fbcdn.net/v/t31.18172-8/920404_10151455603843355_1163235424_o.jpg?_nc_cat=106&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=__whM8sZa-wAX-N_SVY&_nc_ht=scontent.fbma2-1.fna&oh=a4420a9db953e4f66a20aaf74c2b2a6e&oe=612E8092"
                  />
                  <Avatar
                    name="Richard L"
                    src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/221168110_10158374552417522_582055814329159086_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=8B6QFRj4Z2IAX861-e6&_nc_ht=scontent.fbma2-1.fna&oh=4c4d83f1f00af3cce3488add14c17798&oe=612DFA73"
                  />
                  <Avatar
                    name="Rasmus E"
                    src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/62182564_10217135936723107_5145342899025608704_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=eU2XkPusFy4AX9aYd8m&_nc_ht=scontent.fbma2-1.fna&oh=bd399e4af704b6ed3bdf2bdcb0467038&oe=612E3205"
                  />
                </AvatarGroup>
              </Box>
            </Box>
          </Wrap>
        </Flex>
      </CragComponentBox>
      <CragComponentBox>
        <CragGrades />
        <Flex
          justify="center"
          display={{ base: 'wrap', md: 'flex' }}
          padding="20px"
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
      </CragComponentBox>
      <CragComponentBox bg={boxBg}>
        <Box id="cragSectors" mt="5px" pb="5px">
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
              <CragSectorGrid sectors={sectors}>
                {sectors
                  .filter((sector) => sector.name_votes.length >= 1 && sector)
                  .map((sector) => (
                    <CragSector
                      key={sector.id}
                      cragId={crag.id}
                      sectorId={sector.id}
                    >
                      <Text>{mostVoted(sector.name_votes)}</Text>
                      <VoteConflictWarning
                        anyVotes={[sector.name_votes, sector.coordinate_votes]}
                      />
                    </CragSector>
                  ))}
              </CragSectorGrid>
            ) : (
              <Center> No sectors has been added yet.</Center>
            )}
          </Box>
        </Box>
      </CragComponentBox>
      <CragComponentBox>
        <Box mt="10px" mt="5px" pb="5px">
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
                <ModalDialog
                  button={
                    <Box>
                      <Button
                        display={{ base: 'block', md: 'none' }}
                        boxShadow="xl"
                        pr={5}
                        pl={5}
                        m={3}
                        colorScheme="brand"
                        color="white"
                      >
                        <AddIcon />
                      </Button>
                      <Button
                        display={{ base: 'none', md: 'Block' }}
                        boxShadow="xl"
                        pr={5}
                        pl={5}
                        m={3}
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
              </Flex>
            </Box>
          </Box>
          <CragPhotoGrid cragId={cragId} />
        </Box>
      </CragComponentBox>
      <PageFooter></PageFooter>
    </Container>
  )
}
