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
import { CragGrades } from '../components/crag-grades.js'
import { ChevronDownIcon, EditIcon, AddIcon } from '@chakra-ui/icons'
import { PageFooter } from '../components/page-footer.js'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import ModalDialog from '../components/modal-dialog.js'
import AddSector from './add-sector.js'
import AddCragPhoto from './add-crag-photo.js'
import Comments from './comments.js'
import { ParallaxBanner } from 'react-scroll-parallax'

export default function Area() {
  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.100', 'gray.600')
  const buttonBg = useColorModeValue('gray.200', 'gray.600')
  const headingColor = useColorModeValue('gray.900', 'gray.100')
  const headingShadow = useColorModeValue(
    'none',
    '3px 3px 3px rgba(0, 0, 0, 0.2)'
  )

  return (
    <Container bg={bg} padding="0px" maxWidth="100%">
      <Box position="relative" minHeight="95vh" maxHeight="95vh">
        <Box
          height="0px"
          position="sticky"
          zIndex="1"
          top="60px"
          width="100%"
          textAlign="right"
        ></Box>{' '}
        <ParallaxBanner
          layers={[
            {
              image:
                'https://27crags.s3.amazonaws.com/photos/000/093/93516/size_xl-b285d89f0cf0.jpg',
              amount: 0.4,
            },

            {
              amount: 0.6,
              children: (
                <Flex
                  position="sticky"
                  textColor="white"
                  top={{ base: '8vh', md: '20vh', lg: '35vh' }}
                  pl={{ xxl: '500px', xl: '250px', lg: '200px', base: '40px' }}
                  w="100%"
                >
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
                      Uppsala
                    </Heading>
                    <Text
                      ml="20px"
                      textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
                      fontSize={{
                        base: '8pt',
                        sm: '12pt',
                        md: '14pt',
                        lg: '18pt',
                      }}
                      fontWeight="hairline"
                      fontFamily="sans-serif"
                      letterSpacing="tight"
                      color="gray.300"
                    >
                      in the kingdom of{' '}
                      <Link color="white" as={RouterLink} to="/">
                        Sweden
                      </Link>
                    </Text>
                  </Box>
                </Flex>
              ),
            },
          ]}
          style={{
            minHeight: 'inherit',
            maxHeight: 'inherit',
          }}
        ></ParallaxBanner>
      </Box>
      <Box position="relative" minHeight="95vh" maxHeight="95vh">
        <ParallaxBanner
          layers={[
            {
              image:
                'https://27crags.s3.amazonaws.com/photos/000/115/115032/size_xl-7ec2fb2f7245.jpg',
              amount: 0.4,
            },

            {
              amount: 0.2,
              children: (
                <Flex
                  position="sticky"
                  textColor="white"
                  top={{ base: '8vh', md: '20vh', lg: '30vh' }}
                  pl={{ xxl: '650px', xl: '450px', lg: '280px', base: '40px' }}
                  w="100%"
                >
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
                      4,500 Boulders on high quality granite
                    </Heading>
                  </Box>
                </Flex>
              ),
            },
          ]}
          style={{
            minHeight: 'inherit',
            maxHeight: 'inherit',
          }}
        ></ParallaxBanner>
      </Box>{' '}
      <Box position="relative" minHeight="95vh" maxHeight="95vh">
        <ParallaxBanner
          layers={[
            {
              image:
                'https://27crags.s3.amazonaws.com/photos/000/155/155454/size_xl-334be87d7d77.jpg',
              amount: 0.4,
            },

            {
              amount: 0.2,
              children: (
                <Flex
                  position="sticky"
                  textColor="white"
                  top={{ base: '8vh', md: '20vh', lg: '30vh' }}
                  pl={{ xxl: '250px', xl: '150px', lg: '80px', base: '40px' }}
                  w="100%"
                >
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
                      Magical open landscapes
                    </Heading>
                  </Box>
                </Flex>
              ),
            },
          ]}
          style={{
            minHeight: 'inherit',
            maxHeight: 'inherit',
          }}
        ></ParallaxBanner>
      </Box>{' '}
      <CragComponentBox>
        <Flex
          justify="space-between"
          direction={{ base: 'column', xl: 'row' }}
          margin="0px"
        ></Flex>
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
                Crags
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
                            <AddIcon /> <Text ml="5px">New crag </Text>
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

          <Box pb="10px"></Box>
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
            <Comments wrap={true} />
          </Box>
        </Box>
      </CragComponentBox>
      <PageFooter></PageFooter>
    </Container>
  )
}
