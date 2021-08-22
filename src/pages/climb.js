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
} from '@chakra-ui/react'
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
  countVotes,
  mostVoted,
  useUser,
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

export default function Climb() {
  const { cragId, sectorId, climbId } = useParams()
  const { climb, error: errorClimb } = useClimb(climbId)
  const { lines, error: errorLines } = useLines({ climb_id: climbId })
  const { ascents, error: errorAscents } = useAscents({ climb_id: climbId })

  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.300', 'gray.800')
  const buttonBg = useColorModeValue('gray.200', 'gray.600')

  if (errorClimb || errorLines || errorAscents) {
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
  const maxGradeVoteCount = Math.max(Object.values(countedGradeVotes))

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
              </Heading>{' '}
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
                    <Box mt="20px">
                      <Box
                        display={{ base: 'none', md: 'block' }}
                        position="absolute"
                        transform="translate(-130%, 0%)"
                      >
                        <Heading size="sm">#1</Heading>
                      </Box>
                      <Box
                        display={{ base: 'block', md: 'none' }}
                        pl="10px"
                        pb="10px"
                      >
                        <Heading size="sm">Most popular beta footage</Heading>
                      </Box>
                      <VStack>
                        <Box boxShadow="lg" width="100%">
                          <AspectRatio ratio={16 / 9} width="100%">
                            <iframe
                              src="https://www.youtube.com/embed/0pFZYjmuTmE"
                              title="YouTube video player"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                              objectFit="cover"
                            ></iframe>
                          </AspectRatio>
                        </Box>
                      </VStack>
                    </Box>
                    <Box mt="20px">
                      <Box pl="10px" pb="10px">
                        <CragLatestDiscussions direction="column" />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    padding="10px"
                    mt="0x"
                    minW="200px"
                    w={{ base: '100%', md: '20vw' }}
                  >
                    <Flex
                      position={{ base: 'fixed', md: 'sticky' }}
                      zIndex="100"
                      top={{ base: 'unset', md: '7px' }}
                      bottom="0px"
                      right="0px"
                      pl="5px"
                      pr="5px"
                      pb="10px"
                      align="center"
                      justify="space-evenly"
                      w={{ base: '50%', xxxs: '100%', md: '100%' }}
                    >
                      <LinkBox
                        as={RouterLink}
                        to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/add-ascent`}
                      >
                        <Button
                          flexGrow="2"
                          shadow="md"
                          colorScheme="brand"
                          color="white"
                          mr="5px"
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
                      </LinkBox>

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
                      top={{ base: '0px', md: '54px' }}
                      zIndex="docked"
                      borderBottom="1px"
                    >
                      <Flex justify="space-between" align="baseline">
                        <HStack>
                          <Heading size="md">
                            {climb.name_votes.length >= 1
                              ? mostVoted(climb.name_votes)
                              : 'No name votes'}
                          </Heading>
                          <Heading size="md">
                            <Grade gradeId={mostVoted(climb.grade_votes)} />
                          </Heading>
                        </HStack>
                        <LinkBox
                          as={RouterLink}
                          to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-name`}
                        >
                          <Button size="sm" colorScheme="gray">
                            Edit
                          </Button>
                        </LinkBox>
                      </Flex>
                      <Box>
                        <Text>
                          {climb.description_votes.length >= 1
                            ? mostVoted(climb.description_votes)
                            : 'Edit to add description'}
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

                          <LinkBox
                            as={RouterLink}
                            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/vote-climb-beta-video`}
                          >
                            <Button size="sm" colorScheme="brand" color="white">
                              Add
                            </Button>
                          </LinkBox>
                        </Flex>

                        <OrderedList>
                          <ListItem>
                            <Link href="https://www.youtube.com/watch?v=0pFZYjmuTmE">
                              Username - Date - TimeStamp
                            </Link>
                          </ListItem>
                          <ListItem>
                            <Link href="https://www.youtube.com/watch?v=0pFZYjmuTmE">
                              Username - Date - TimeStamp
                            </Link>
                          </ListItem>
                        </OrderedList>
                      </Box>
                      <Box mt="10px" padding="10px" bgColor={boxBg}>
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
                        <Flex justify="space-between" align="baseline">
                          <Heading size="sm">Ticks</Heading>
                          <Spacer />
                          <LinkBox
                            as={RouterLink}
                            to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}/add-ascent`}
                          >
                            <Button size="sm" colorScheme="brand" color="white">
                              <TickRocksLogo
                                colorGreen="#fff"
                                colorWhite="#3CAB70"
                                h="12px"
                                w="20px"
                                mr="5px"
                              />
                              tick
                            </Button>
                          </LinkBox>
                          /
                          <Button size="sm" colorScheme="gray">
                            <TickRocksLogo h="12px" w="20px" mr="5px" />
                            ticked
                          </Button>
                        </Flex>
                        {ascents.length === 0
                          ? 'There are no ascents.'
                          : ascents.map((ascent) => (
                              <Ascent key={ascent.id} ascent={ascent} />
                            ))}
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

function Ascent({ ascent }) {
  const { user } = useUser(ascent.user_id)

  return (
    <Skeleton isLoaded={user !== undefined}>
      <Box>
        <Flex>
          <Box>{user?.display_name || 'Unnamed user'} </Box>
          <Spacer />
          <Box>{new Date(ascent.ascent_date).toISOString().slice(0, 10)}</Box>
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
    <Box marginTop="20px" boxShadow="lg" bg={boxBg}>
      <LineImage image={image} lines={[line]} />
    </Box>
  )
}
