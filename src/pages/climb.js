import {
  Container,
  Center,
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Progress,
  Link,
  LinkBox,
  Flex,
  Button,
  Spacer,
  AspectRatio,
  OrderedList,
  ListItem,
  Skeleton,
  Avatar,
  Tag,
  TagLeftIcon,
  TagLabel,
  Icon,
  TagRightIcon,
  Tooltip,
  Wrap,
  Alert,
  AlertIcon,
  CloseButton,
  Image,
  Collapse,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react'
import Linkify from 'react-linkify'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import EditButton from '../components/edit-button.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import Grade from '../components/grade.js'
import {
  useClimb,
  useLines,
  useImage,
  useAscents,
  useBetaVideos,
  countVotes,
  mostVoted,
  useUser,
  useCurrentUser,
} from '../utils/backend.js'
import LineImage from '../components/line-image.js'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import StarRatings from 'react-star-ratings'
import {
  CragBanner,
  CragBannerMenu,
  CragBannerMenuButton,
} from '../components/crag-banner.js'
import { CragLatestDiscussions } from '../components/crag-latestdiscussions.js'
import { PageFooter } from '../components/page-footer.js'
import { CragComponentBox } from '../components/crag-component-box.js'
import { TickRocksLogo } from '../components/tick-rocks-logo.js'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { AddIcon, ChevronDownIcon, SunIcon } from '@chakra-ui/icons'
import ModalDialog from '../components/modal-dialog.js'
import AddAscent from './add-ascent.js'
import Comments from './comments.js'
import AddBetaVideo from './add-beta-video.js'
import React from 'react'

export default function Climb() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { lines, error: errorLines } = useLines({ climb_id: climbId })
  const { ascents, error: errorAscents } = useAscents({ climb_id: climbId })
  const { betaVideos, error: errorBetaVideos } = useBetaVideos({
    climb_id: climbId,
  })

  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.100', 'gray.800')
  const buttonBg = useColorModeValue('gray.100', 'gray.600')

  if (errorClimb || errorLines || errorAscents || errorBetaVideos) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load climb.</Text>
        </Center>
      </Container>
    )
  }

  if (climb === undefined || lines === undefined || ascents === undefined) {
    return <Loader />
  }

  const countedGradeVotes = countVotes(climb.grade_votes)
  const maxGradeVoteCount = Math.max(Object?.values(countedGradeVotes))

  return (
    <Box>
      <Flex direction="column" height="95vh">
        <Container bg={bg} maxWidth="100%" flexGrow="1" padding="0px" pb="30px">
          <CragBanner cragId={cragId}>
            <ClimbBreadcrumb climbId={climbId} />
            <Flex>
              <Heading size="xl">
                {climb.name_votes.length >= 1
                  ? mostVoted(climb.name_votes)
                  : 'No name votes'}
                <LinkBox
                  as={RouterLink}
                  to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-name`}
                >
                  <Box as="sup">
                    <EditButton />
                    <VoteConflictWarning votes={climb.name_votes} />
                  </Box>
                </LinkBox>
              </Heading>
              <Heading size="xl">
                <Grade gradeId={mostVoted(climb.grade_votes)} />
                <LinkBox
                  as={RouterLink}
                  to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-grade`}
                >
                  <Box as="sup">
                    <EditButton />
                    <VoteConflictWarning votes={climb.grade_votes} />
                  </Box>
                </LinkBox>
              </Heading>
            </Flex>
            <Heading size="sm">
              {climb.rating_votes.length >= 1 ? (
                <StarRatings
                  rating={mostVoted(climb.rating_votes)}
                  starRatedColor="gold"
                  numberOfStars={5}
                  name="rating"
                  starEmptyColor="gray"
                  starDimension="35px"
                />
              ) : (
                'No rating votes'
              )}
              <LinkBox
                as={RouterLink}
                to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-rating`}
              >
                <Box as="sup">
                  <EditButton />
                </Box>
              </LinkBox>
            </Heading>
          </CragBanner>
          <CragBannerMenu cragId={cragId}></CragBannerMenu>
          <Box>
            <Box>
              <Box>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  justify="center"
                >
                  <Box>
                    <Box>
                      <Alert status="info">
                        <AlertIcon />
                        New comment! Rasmus: Kul och så men va i hela jäv...
                        View now{' '}
                        <CloseButton
                          position="absolute"
                          right="8px"
                          top="8px"
                        />
                      </Alert>
                    </Box>
                    {lines.length === 0 ? (
                      <Box boxShadow="xl">
                        <Text>
                          There are no drawn lines for this climb. To add new
                          topo, go to Sector, Edit, New Topo.
                        </Text>
                        <Button
                          as={RouterLink}
                          to={`/crags/${cragId}/sectors/${sectorId}`}
                        >
                          Back to sector
                        </Button>
                      </Box>
                    ) : (
                      <Flex direction="column">
                        {lines.map((line) => (
                          <ImageWithLines key={line.id} line={line} />
                        ))}
                      </Flex>
                    )}
                    <Box>
                      {betaVideos?.length > 0 ? (
                        <Box>
                          <Box mt="10px">
                            <Box
                              display={{ base: 'none', md: 'block' }}
                              position="absolute"
                              transform="translate(-110%, 0%)"
                            >
                              <Heading size="sm">#1 Beta video</Heading>
                            </Box>
                            <Box
                              display={{ base: 'block', md: 'none' }}
                              pl="10px"
                              pb="10px"
                            >
                              <Heading size="sm">
                                Most popular beta video
                              </Heading>
                            </Box>
                            <Box boxShadow="lg" width="100%">
                              <AspectRatio ratio={16 / 9} width="100%">
                                <iframe
                                  src={`https://www.youtube.com/embed/${youtube_parser(
                                    betaVideos[0]?.video_url
                                  )}`}
                                  title="YouTube video player"
                                  frameborder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                  objectFit="cover"
                                ></iframe>
                              </AspectRatio>
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <Box></Box>
                      )}
                    </Box>
                    <Box mt="20px">
                      <Box pl="10px" pb="10px" mx="10px">
                        <Heading fontSize={{ base: 'md', md: 'xl' }} mb="10px">
                          Comments
                        </Heading>
                        <Comments relatedId={climbId} wrap={false} />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    padding="10px"
                    mt="0x"
                    minW={{ base: '300px', lg: '350px', xl: '400px' }}
                    w={{ base: '100%', md: '20vw' }}
                  >
                    <Flex
                      position={{ base: 'fixed', md: 'sticky' }}
                      zIndex="100"
                      top={{ base: 'unset', md: '61px' }}
                      bottom="0px"
                      right="0px"
                      pl="5px"
                      pr="5px"
                      pb="10px"
                      align="center"
                      justify="space-evenly"
                      w={{ base: '50%', xxxs: '100%', md: '100%' }}
                    >
                      <Box flexGrow="2">
                        <ModalDialog
                          button={
                            <Box mr="5px">
                              <Button
                                w="100%"
                                shadow="md"
                                colorScheme="brand"
                                color="white"
                              >
                                <TickRocksLogo
                                  colorGreen="#fff"
                                  colorWhite="#3CAB70"
                                  h="20px"
                                  w="30px"
                                  mr="5px"
                                />
                                tick
                              </Button>
                            </Box>
                          }
                        >
                          <AddAscent />
                        </ModalDialog>
                      </Box>

                      <Button
                        flexGrow="1"
                        shadow="md"
                        bgColor={buttonBg}
                        colorScheme="gray"
                      >
                        Pre-tick
                      </Button>
                    </Flex>
                    <Box
                      padding="10px"
                      bgColor={bg}
                      position={{ base: 'relative', md: 'sticky' }}
                      top={{ base: '0px', md: '107px' }}
                      zIndex="2"
                      borderBottom="1px"
                    >
                      <Flex justify="space-between" align="baseline">
                        <HStack>
                          <Heading wordBreak="break-all" size="sm">
                            {climb.name_votes.length >= 1
                              ? mostVoted(climb.name_votes)
                              : 'No name votes'}
                            {', '}
                            <Grade gradeId={mostVoted(climb.grade_votes)} />
                          </Heading>
                        </HStack>
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
                              to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-name`}
                            >
                              Edit name
                            </MenuItem>
                            <MenuItem
                              as={RouterLink}
                              to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-description`}
                            >
                              Edit description
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>
                      <Box>
                        <Text>
                          <Linkify>
                            {climb.description_votes.length >= 1
                              ? mostVoted(climb.description_votes)
                              : 'Edit to add description'}
                          </Linkify>
                        </Text>
                      </Box>
                    </Box>
                    <Box>
                      <Box padding="10px" bgColor={boxBg} mt="10px">
                        <Box>
                          <Flex justify="space-between" align="baseline">
                            <Heading size="sm">Grade votes</Heading>
                            <LinkBox
                              as={RouterLink}
                              to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-grade`}
                            >
                              <Button size="sm" colorScheme="gray">
                                Vote
                              </Button>
                            </LinkBox>
                          </Flex>
                          {countedGradeVotes.length === 0 ? (
                            <Text>There are no grade votes.</Text>
                          ) : (
                            countedGradeVotes.map((vote) => (
                              <Box key={vote.value}>
                                <HStack>
                                  <Grade gradeId={vote.value} />
                                  <Text>({vote.count} votes)</Text>
                                </HStack>
                                <Progress
                                  value={vote.count / maxGradeVoteCount}
                                />
                              </Box>
                            ))
                          )}
                        </Box>
                      </Box>
                      <Box padding="10px" bgColor={boxBg} mt="10px">
                        <Flex
                          wrap="wrap"
                          justify="space-between"
                          align="baseline"
                        >
                          <Heading size="sm">Rating</Heading>

                          <LinkBox
                            as={RouterLink}
                            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-rating`}
                          >
                            <Button size="sm" colorScheme="gray">
                              Vote
                            </Button>
                          </LinkBox>
                        </Flex>
                        <Box>
                          {climb.rating_votes.length >= 1 ? (
                            <StarRatings
                              rating={mostVoted(climb.rating_votes)}
                              starRatedColor="gold"
                              numberOfStars={5}
                              name="rating"
                              starEmptyColor="gray"
                              starDimension="20px"
                              starSpacing="2px"
                            />
                          ) : (
                            'No rating votes'
                          )}
                        </Box>
                      </Box>{' '}
                      <Box mt="10px" padding="10px" bgColor={boxBg}>
                        <Flex justify="space-between" align="baseline">
                          <Heading size="sm">Beta videos</Heading>
                          <ModalDialog
                            button={
                              <Box>
                                <Button
                                  size="sm"
                                  shadow="md"
                                  colorScheme="brand"
                                  color="white"
                                >
                                  Add
                                </Button>
                              </Box>
                            }
                          >
                            <AddBetaVideo />
                          </ModalDialog>
                        </Flex>

                        <Box>
                          {betaVideos?.length === 0
                            ? 'There are no beta videos.'
                            : betaVideos?.map((betaVideo) => (
                                <BetaVideo
                                  key={betaVideo.id}
                                  betaVideo={betaVideo}
                                />
                              ))}
                        </Box>
                      </Box>
                      <Box
                        mt="10px"
                        padding="10px"
                        bgColor={boxBg}
                        display="none"
                      >
                        <Flex justify="space-between" align="baseline">
                          <Heading size="sm">External Links</Heading>

                          <LinkBox
                            as={RouterLink}
                            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-external-link`}
                          >
                            <Button size="sm" colorScheme="brand" color="white">
                              Add
                            </Button>
                          </LinkBox>
                        </Flex>
                        <OrderedList>
                          <ListItem>
                            <Link href="https://www.youtube.com/watch?v=0pFZYjmuTmE">
                              Link
                            </Link>
                          </ListItem>
                          <ListItem>
                            <Link href="https://www.youtube.com/watch?v=0pFZYjmuTmE">
                              Link
                            </Link>
                          </ListItem>
                        </OrderedList>
                      </Box>
                      <Box padding="10px" bgColor={boxBg} mt="10px">
                        <Flex w="100%" justify="space-between" align="baseline">
                          <Heading size="sm">Ticks</Heading>
                          <Spacer />
                          <Box>
                            <ModalDialog
                              button={
                                <Box>
                                  <Button
                                    size="sm"
                                    shadow="md"
                                    colorScheme="brand"
                                    color="white"
                                  >
                                    <TickRocksLogo
                                      colorGreen="#fff"
                                      colorWhite="#3CAB70"
                                      h="12px"
                                      w="20px"
                                      mr="5px"
                                    />
                                    tick
                                  </Button>
                                </Box>
                              }
                            >
                              <AddAscent />
                            </ModalDialog>
                          </Box>
                        </Flex>
                        <Ascents ascents={ascents} />
                      </Box>
                      <Box padding="10px" bgColor={boxBg} mt="10px">
                        <Flex justify="space-between" align="baseline">
                          <Heading size="sm">Pre-ticks</Heading>
                          <Button size="sm" colorScheme="gray">
                            Pre-tick
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Container>
        <PageFooter />
      </Flex>
    </Box>
  )
}

function Ascents({ ascents }) {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  return (
    <Box>
      {ascents.length > 9 ? (
        <Box>
          <Collapse startingHeight="600px" in={show}>
            {ascents.length === 0
              ? 'There are no ascents.'
              : ascents
                  .filter((ascent) => ascent.public === true)
                  .map((ascent) => <Ascent key={ascent.id} ascent={ascent} />)}
          </Collapse>
          <Box>
            {show ? (
              ''
            ) : (
              <Button
                w="100%"
                onClick={handleToggle}
                mt="5px"
                colorScheme="gray"
                boxShadow="md"
              >
                View all
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          {ascents.length === 0
            ? 'There are no ascents.'
            : ascents
                .filter((ascent) => ascent.public === true)
                .map((ascent) => <Ascent key={ascent.id} ascent={ascent} />)}
        </Box>
      )}
    </Box>
  )
}

function Ascent({ ascent }) {
  const { user } = useUser(ascent.user_id)

  return (
    <Skeleton
      borderBottom="1px"
      _last={{ borderBottom: '0px' }}
      isLoaded={user !== undefined}
    >
      <Box mt="7px" mb="7px" fontSize="xs">
        <Flex justify="flex-start">
          <Box w="50px" as={RouterLink} to={`/user/${user?.id}`}>
            <Avatar h="40px" w="40px" name={user?.display_name}></Avatar>
          </Box>
          <Flex direction="column" flexGrow="5">
            <Flex justify="space-between">
              <Box
                fontWeight="semibold"
                as={RouterLink}
                to={`/user/${user?.id}`}
              >
                <Text> {user?.display_name || 'Unnamed user'} </Text>
              </Box>
              <Spacer />
              <Box>
                {new Date(ascent.ascent_date).toISOString().slice(0, 10)}
              </Box>
              <Box>
                {user?.id === useCurrentUser().user?.id ? (
                  <Box>
                    <ModalDialog
                      button={
                        <Box>
                          <Button size="xs">Edit</Button>
                        </Box>
                      }
                    >
                      <AddAscent ascent={ascent} />
                    </ModalDialog>
                  </Box>
                ) : (
                  ''
                )}
              </Box>
            </Flex>
            <HStack>
              <AscentType ascent={ascent} />

              <Box>
                <Grade />
              </Box>
              <Box>
                <StarRatings
                  rating={2}
                  starRatedColor="gold"
                  numberOfStars={5}
                  name="rating"
                  starEmptyColor="none"
                  starDimension="18px"
                  starSpacing="0px"
                />
              </Box>
            </HStack>
            <Box>
              <Text fontSize="xs">
                <Linkify>{ascent.description}</Linkify>
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Skeleton>
  )
}

function AscentType({ ascent }) {
  const RedPoint = (props) => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  )
  const OnSight = (props) => (
    <Icon viewBox="0 0 55 40" {...props}>
      <path
        fill="currentColor"
        d="M29.07.07h-.52S10.74-2.05 0 17.01c10.74 19.02 28.55 16.95 28.55 16.95h.52s17.81 2.07 28.55-16.95C46.88-2.05 29.07.07 29.07.07zm0 7.88c3.07 0 5.56 2.52 5.56 5.62 0 3.11-2.49 5.62-5.56 5.62s-5.56-2.52-5.56-5.62S26 7.95 29.07 7.95zm.1 20.35h-.34S17.4 29.64 10.51 17.63c1.91-3.34 4.17-5.63 6.45-7.23-.31 1.1-.48 2.24-.48 3.44 0 7.03 5.64 12.73 12.59 12.73 6.96 0 12.59-5.7 12.59-12.73 0-1.15-.16-2.26-.44-3.31 2.21 1.58 4.41 3.85 6.28 7.1C40.6 29.64 29.17 28.3 29.17 28.3z"
      />
    </Icon>
  )

  const Flash = (props) => (
    <Icon viewBox="-50 0 300 100" {...props}>
      <path
        fill="currentColor"
        d="M0 186.31 54.38 38.831 4.602 37.24l67.434-143.95 67.424.132-33.097 87.63 52.235-.454L0 186.309z"
      />
    </Icon>
  )

  if (ascent.ascent_type === 'redpoint') {
    return (
      <Tooltip
        closeDelay={500}
        hasArrow
        label={ascent.attempts}
        bg="gray.300"
        color="black"
      >
        <Tag size="sm" variant="subtle" colorScheme="red">
          <TagLeftIcon boxSize="15px" as={RedPoint} color="red" />
          <TagLabel size="sm">Rotpunkt</TagLabel>
        </Tag>
      </Tooltip>
    )
  }

  if (ascent.ascent_type === 'onsight') {
    return (
      <Tooltip
        closeDelay={500}
        hasArrow
        label="First try!"
        bg="gray.300"
        color="black"
      >
        <Tag size="sm" variant="subtle" colorScheme="orange">
          <TagLeftIcon boxSize="15px" as={OnSight} />
          <TagLabel>On-sight</TagLabel>
        </Tag>
      </Tooltip>
    )
  }
  if (ascent.ascent_type === 'flash') {
    return (
      <Tooltip
        closeDelay={500}
        hasArrow
        label="First try!"
        bg="gray.300"
        color="black"
      >
        <Tag size="sm" variant="subtle" colorScheme="yellow">
          <TagLeftIcon boxSize="15px" as={Flash} />
          <TagLabel>Flash!</TagLabel>
        </Tag>
      </Tooltip>
    )
  }
  return ''
}

function BetaVideo({ betaVideo }) {
  const { user } = useUser(betaVideo.user_id)
  const youtubeVideoId = youtube_parser(betaVideo.video_url)

  return (
    <Skeleton
      borderBottom="1px"
      _last={{ borderBottom: '0px' }}
      isLoaded={user !== undefined}
    >
      <Box mt="7px" mb="7px" fontSize="xs">
        <Flex justify="space-between" align="flex-start">
          <Flex direction="column">
            <Flex align="flex-start">
              <Box minW="80px" maxW="80px">
                <ModalDialog
                  size="4xl"
                  button={
                    <Image
                      cursor="pointer"
                      mt="5px"
                      src={`https://img.youtube.com/vi/${youtubeVideoId}/sddefault.jpg`}
                    />
                  }
                >
                  <Box h="80vh">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                      title="YouTube video player"
                      height="100%"
                      width="100%"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      objectFit="cover"
                    ></iframe>
                  </Box>
                </ModalDialog>
              </Box>
              <Flex ml="10px" direction="column">
                <Heading size="xs" as={RouterLink} to={`/user/${user?.id}`}>
                  {user?.display_name || 'Unnamed user'}
                </Heading>
                <Linkify>{betaVideo.timestamp}</Linkify>
              </Flex>
            </Flex>
          </Flex>
          <Box>
            {user?.id === useCurrentUser().user?.id ? (
              <VStack align="right" mt="5px">
                <Box>
                  <Button size="xs">Like</Button>
                </Box>
                <ModalDialog
                  button={
                    <Box>
                      <Button size="xs">Edit</Button>
                    </Box>
                  }
                ></ModalDialog>
              </VStack>
            ) : (
              <Box>
                <Button size="xs">Like</Button>
              </Box>
            )}
          </Box>
        </Flex>
      </Box>
    </Skeleton>
  )
}

function ImageWithLines({ line }) {
  const { image, error: errorImage } = useImage(line.image_id)

  const boxBg = useColorModeValue('gray.300', 'gray.600')
  // const { lines: otherLines, error: errorOtherLines } = useLines({ image_id: line.image_id })

  if (errorImage) {
    return (
      <Center>
        <Text margin="20px">Failed to load image/lines.</Text>
      </Center>
    )
  }

  if (image === undefined) {
    return <Loader />
  }

  return (
    <Box marginTop="5px" boxShadow="lg" bg={boxBg}>
      <LineImage image={image} lines={[line]} />
    </Box>
  )
}

function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  var match = url.match(regExp)
  return match && match[7].length == 11 ? match[7] : false
}
