import { useColorModeValue } from '@chakra-ui/color-mode'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  AspectRatio,
  Avatar,
  Box,
  Button,
  Center,
  Collapse,
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
  Progress,
  Skeleton,
  Spacer,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import Linkify from 'react-linkify'
import { Link as RouterLink, useParams } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import AscentType from '../components/ascent-type.js'
import { BetaVideo, youtube_parser } from '../components/beta-video.js'
import { ClimbBreadcrumb } from '../components/breadcrumb.js'
import { CragBanner, CragBannerMenu } from '../components/crag-banner.js'
import EditButton from '../components/edit-button.js'
import Grade from '../components/grade.js'
import LineImage from '../components/line-image.js'
import Loader from '../components/loader.js'
import ModalDialog from '../components/modal-dialog.js'
import { PageFooter } from '../components/page-footer.js'
import { TickRocksLogo } from '../components/tick-rocks-logo.js'
import VoteConflictWarning from '../components/vote-conflict-warning.js'
import {
  countVotes,
  mostVoted,
  useAscents,
  useBetaVideos,
  useClimb,
  useCurrentUser,
  useImage,
  useLines,
  useUser,
} from '../utils/backend.js'
import AddAscent from './add-ascent.js'
import AddBetaVideo from './add-beta-video.js'
import Comments from './comments.js'
import RemovePage from './remove-page.js'
import VoteClimbBroken from './vote-climb-broken.js'

export default function Climb() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { lines, error: errorLines } = useLines({ climb_id: climbId })
  const { ascents, error: errorAscents } = useAscents({ climb_id: climbId })
  const { betaVideos, error: errorBetaVideos } = useBetaVideos({
    climb_id: climbId,
  })

  const bg = useColorModeValue('gray.100', 'gray.700')
  const boxBg = useColorModeValue('offwhite', 'gray.800')
  const buttonBg = useColorModeValue('gray.200', 'gray.600')

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
                    {climb.broken_votes.length >= 1 ? (
                      <Box>
                        <Alert status="warning">
                          <AlertIcon />
                          This problem is flagged as broken by{' '}
                          {climb.broken_votes.length} user(s).
                        </Alert>
                      </Box>
                    ) : (
                      ''
                    )}

                    {lines.length === 0 ? (
                      <Box>
                        {' '}
                        <Alert status="warning">
                          <Text>
                            There are no drawn lines for this climb. Go to
                            Sector, Edit, New Topo.
                          </Text>
                          <Button
                            ml="10px"
                            size="sm"
                            as={RouterLink}
                            to={`/crags/${cragId}/sectors/${sectorId}`}
                          >
                            Back to sector
                          </Button>{' '}
                        </Alert>
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
                            <Box pl="10px" pb="10px">
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
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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
                            minW="70px"
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

                            <ModalDialog
                              button={<MenuItem>Vote broken</MenuItem>}
                            >
                              <VoteClimbBroken />
                            </ModalDialog>
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
                                  colorScheme="brand"
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
                                    px="20px"
                                    size="sm"
                                    shadow="md"
                                    colorScheme="brand"
                                    color="white"
                                  >
                                    <TickRocksLogo
                                      colorGreen="#fff"
                                      colorWhite="#3CAB70"
                                      h="18px"
                                      w="25px"
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
          <Box
            mr="5px"
            mt="5px"
            w="50px"
            as={RouterLink}
            to={`/user/${user?.id}`}
          >
            <Avatar h="40px" w="40px" name={user?.display_name}></Avatar>
          </Box>
          <Flex direction="column" flexGrow="5">
            <Flex justify="space-between" align="center">
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
          <Box>
            {user?.id === useCurrentUser().user?.id ? (
              <Menu>
                <MenuButton
                  ml="5px"
                  as={IconButton}
                  size="sm"
                  icon={<ChevronDownIcon />}
                ></MenuButton>
                <MenuList fontSize="md">
                  <ModalDialog button={<MenuItem>Edit</MenuItem>}>
                    <AddAscent ascent={ascent} />
                  </ModalDialog>
                  <ModalDialog button={<MenuItem>Remove</MenuItem>}>
                    <RemovePage
                      item={ascent}
                      itemType="ascent"
                      itemPath="ascents"
                    />
                  </ModalDialog>
                </MenuList>
              </Menu>
            ) : (
              ''
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
