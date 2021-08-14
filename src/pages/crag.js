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
  Spacer,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import { useCrag, useSectors, mostVoted } from '../utils/backend.js'
import {
  CragFrontPageBannerMenu,
  CragFrontPageBanner,
} from '../components/crag-banner.js'
import { CragPhotoGrid } from '../components/crag-photos.js'
import { CragComponentBox } from '../components/crag-component-box'
import { CragSectorGrid, CragSector } from '../components/crag-sectors.js'
import { CragGrades } from '../components/crag-grades.js'
import { CragLatestDiscussions } from '../components/crag-latestdiscussions'
import { ChevronDownIcon, EditIcon, AddIcon } from '@chakra-ui/icons'

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
    <Container bg="gray.700" padding="0px" maxWidth="100%">
      <Button
        display={{ base: 'block', sm: 'none' }}
        zIndex="banner"
        position="fixed"
        borderRadius="40px"
        bottom="10px"
        left="15px"
        shadow="dark-lg"
        w="75px"
        colorScheme="telegram"
      >
        Topo
      </Button>

      <CragFrontPageBanner cragBannerImage="https://27crags.s3.amazonaws.com/photos/000/213/213830/size_xl-9d8dc766475a.jpg">
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
            textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
            fontSize={{ base: '8pt', sm: '12pt', md: '14pt', lg: '18pt' }}
            fontWeight="hairline"
            fontFamily="sans-serif"
            letterSpacing="tight"
          >
            in the area of Fontainebleau, France
          </Text>
        </Box>
      </CragFrontPageBanner>
      <CragFrontPageBannerMenu>
        <Menu>
          <MenuButton _hover={{ textColor: 'brand.200' }} padding="8px">
            <Center>
              <Text
                display={{ base: 'none', sm: 'block' }}
                fontWeight="normal"
                fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
                letterSpacing="1.5pt"
                _hover={{ color: 'brand.200' }}
              >
                Edit <ChevronDownIcon />
              </Text>{' '}
              <EditIcon display={{ base: 'block', sm: 'none' }} />{' '}
            </Center>
          </MenuButton>
          <MenuList>
            <MenuItem as={RouterLink} to={`/crags/${crag.id}/add-sector`}>
              Add Sector
            </MenuItem>
            <MenuItem as={RouterLink} to="/">
              Add Photo
            </MenuItem>
          </MenuList>
        </Menu>
      </CragFrontPageBannerMenu>

      <CragComponentBox>
        <CragGrades />
      </CragComponentBox>

      <CragComponentBox>
        <Flex
          justify="flex-start"
          direction={{ base: 'column', md: 'row' }}
          margin="0px"
        >
          <Box id="cragAccess" mt="5px" mb="5px" mr="5px">
            <Heading
              textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
              padding="10px"
              color="white"
              size="2xl"
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
                  <VoteConflictWarning votes={crag.access_information_votes} />
                </Box>
              </LinkBox>
            </Heading>
            <Box pl="10px" pr="10px" pb="10px" w="100%">
              <Text overflowWrap="break-word" color="white">
                {crag.access_information_votes.length === 0
                  ? 'No access information has been added.'
                  : mostVoted(crag.access_information_votes)}
              </Text>
            </Box>
          </Box>
          <Spacer />
          <Box as={RouterLink} to="authors" margin="5px">
            <Heading
              textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
              padding="10px"
              color="white"
              size="2xl"
              fontFamily="sans-serif"
              fontWeight="bold"
              letterSpacing="tighter"
            >
              Authors{' '}
            </Heading>
            <Box pl="10px" pb="10px" w="30vw">
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
        </Flex>
      </CragComponentBox>

      <CragComponentBox bg="gray.600">
        <Box id="cragSectors" mt="5px" mb="5px" padding="10px">
          <Box zIndex="2" position="sticky" top="55px" bottom="0px" pb="10px">
            <Flex flexWrap="wrap">
              <Heading
                color="white"
                size="2xl"
                fontFamily="sans-serif"
                fontWeight="bold"
                letterSpacing="tighter"
                textShadow="3px 3px 3px rgba(0, 0, 0, 0.2)"
              >
                Sectors
              </Heading>
              <Spacer />
              <Stack spacing={2} direction="row" align="center" flexWrap="wrap">
                <Button
                  display={{ base: 'block', md: 'none' }}
                  boxShadow="xl"
                  pr={2}
                  pl={2}
                  colorScheme="green"
                >
                  <AddIcon />
                </Button>
                <Box as={RouterLink} to={`/crags/${crag.id}/add-sector`}>
                  <Button
                    display={{ base: 'none', md: 'block' }}
                    boxShadow="xl"
                    pr={4}
                    pl={4}
                    colorScheme="green"
                    leftIcon={<AddIcon />}
                  >
                    New sector
                  </Button>
                </Box>
                <Button boxShadow="xl" pr={4} pl={4} colorScheme="gray">
                  View all
                </Button>
              </Stack>
            </Flex>
          </Box>

          <Box>
            <CragSectorGrid>
              {sectors
                .filter((sector) => sector.name_votes.length >= 1)
                .map((sector) => (
                  <Box key={sector.id}>
                    <CragSector
                      to={`/crags/${crag.id}/sectors/${sector.id}`}
                      img="https://27crags.s3.amazonaws.com/photos/000/075/75038/size_xl-51f3b20cc4af.png"
                    >
                      <Text>{mostVoted(sector.name_votes)}</Text>
                      <VoteConflictWarning
                        anyVotes={[sector.name_votes, sector.coordinate_votes]}
                      />
                    </CragSector>
                  </Box>
                ))}
            </CragSectorGrid>
          </Box>
        </Box>
      </CragComponentBox>
      <CragComponentBox>
        <CragLatestDiscussions />
      </CragComponentBox>
      <CragComponentBox>
        <Box id="cragPhotos" mt="5px" mb="5px">
          <Box position="sticky" top="55px" mt="10px" mb="5px" zIndex="2">
            <Box mt="10px" mb="5px">
              <Flex>
                <Heading
                  flex="1"
                  color="white"
                  size="2xl"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  letterSpacing="tighter"
                  padding="10px"
                  textShadow="3px 3px 3px rgba(0, 0, 0, 0.2)"
                >
                  Photos of{' '}
                  {crag.name_votes.length >= 1
                    ? mostVoted(crag.name_votes)
                    : 'No name votes'}
                </Heading>
                <Button
                  display={{ base: 'block', md: 'none' }}
                  boxShadow="xl"
                  pr={5}
                  pl={5}
                  m={3}
                  colorScheme="green"
                >
                  <AddIcon />
                </Button>
                <Button
                  display={{ base: 'none', md: 'Block' }}
                  boxShadow="xl"
                  pr={5}
                  pl={5}
                  m={3}
                  colorScheme="green"
                  leftIcon={<AddIcon />}
                >
                  Upload
                </Button>
              </Flex>
            </Box>
          </Box>
          <CragPhotoGrid />
        </Box>
      </CragComponentBox>
      <CragComponentBox>
        <Center as={RouterLink} to="/" color="white">
          {' '}
          tick.rocks
        </Center>
      </CragComponentBox>
    </Container>
  )
}
