import { useState } from 'react'
import { Table, Tbody, Td, Th, Thead, Tr, Link, HStack } from '@chakra-ui/react'
import { CragBanner, CragBannerMenu } from '../components/crag-banner'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex, LinkBox, Heading, Text } from '@chakra-ui/layout'
import { Link as RouterLink, useParams } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { FaCommentDots, FaVideo, FaHeartBroken } from 'react-icons/fa'
import {
  useCrag,
  mostVoted,
  useClimbs,
  useGradeSystemGrades,
  useSector,
  useBetaVideos,
  useComments,
  useAscents,
  useCurrentUser,
} from '../utils/backend'

const defaultSortAscending = false
const linkColor = 'blue.500'

export default function CragList() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const { climbs, error: errorClimbs } = useClimbs({ crag_id: cragId })

  if (crag === undefined || climbs === undefined) {
    return null
  }

  if (errorCrag || errorClimbs) {
    return <Text>Error</Text>
  }
  return (
    <Box>
      <Box>
        <CragBanner cragId={cragId}>
          <LinkBox as={RouterLink} to={`/crags/${cragId}`}>
            <Heading
              textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
              fontFamily="sans-serif"
              fontWeight="bold"
              letterSpacing="tighter"
            >
              List of:{' '}
              {crag.name_votes.length >= 1
                ? mostVoted(crag.name_votes)
                : 'No name votes'}
            </Heading>
          </LinkBox>
        </CragBanner>
        <CragBannerMenu></CragBannerMenu>
        <Flex
          pl={{
            md: '15vw',
            base: '20px',
          }}
          pr={{
            md: '15vw',
            base: '20px',
          }}
          position="relative"
          justify="space-between"
          marginTop="5"
        >
          <div
            className="ag-theme-alpine"
            style={{ width: '100%', paddingBottom: '300px' }}
          >
            <RouteTable climbs={climbs} />
          </div>
        </Flex>
      </Box>
    </Box>
  )
}

const RouteTable = ({ climbs }) => {
  const [sortKey, setSortKey] = useState('rating')
  const [sortAscending, setSortAscending] = useState(defaultSortAscending)

  const { gradeSystemGrades, error } = useGradeSystemGrades()
  if (gradeSystemGrades === undefined || error) {
    return null // TODO: return a loader
  }
  const gradeMap = Object.assign(
    {},
    ...gradeSystemGrades.map((grade) => ({
      [grade.id]: {
        fuzzyUnifiedRank: grade.fuzzy_unified_rank,
        grade: grade.grade,
        rank: grade.rank,
        system: grade.system,
      },
    }))
  )

  return (
    <Table size="md">
      <Thead>
        <Tr>
          <SortableColumn
            name={'Name'}
            sortKey={'name'}
            currentSortKey={sortKey}
            setSortKey={setSortKey}
            currentSortAscending={sortAscending}
            setSortAscending={setSortAscending}
          />
          <SortableColumn
            name={'Grade'}
            sortKey={'grade'}
            currentSortKey={sortKey}
            setSortKey={setSortKey}
            currentSortAscending={sortAscending}
            setSortAscending={setSortAscending}
          />
          <SortableColumn
            name={'Rating'}
            sortKey={'rating'}
            currentSortKey={sortKey}
            setSortKey={setSortKey}
            currentSortAscending={sortAscending}
            setSortAscending={setSortAscending}
          />
          <ColumnHeading>Ascents</ColumnHeading>
          <SortableColumn
            name={'Type'}
            sortKey={'type'}
            currentSortKey={sortKey}
            setSortKey={setSortKey}
            currentSortAscending={sortAscending}
            setSortAscending={setSortAscending}
          />
          <ColumnHeading>Sector</ColumnHeading>
        </Tr>
      </Thead>
      <Tbody>
        {climbs
          .sort((climbA, climbB) =>
            sortField(climbA, sortKey, gradeMap) <
            sortField(climbB, sortKey, gradeMap)
              ? sortAscending
                ? -1
                : 1
              : sortField(climbB, sortKey, gradeMap) <
                sortField(climbA, sortKey, gradeMap)
              ? sortAscending
                ? 1
                : -1
              : 0
          )
          .map((climb) => (
            <TableRow climb={climb}>
              <NameCell climb={climb} />
              {/* TODO: should display grade, not most voted */}
              <Td>{gradeMap[climb.most_voted_grade]?.grade}</Td>
              <RatingCell climb={climb} />
              <AscentsCell climb={climb} />
              <ClimbTypeCell climb={climb} />
              <SectorCell climb={climb} />
            </TableRow>
          ))}
      </Tbody>
    </Table>
  )
}

const TableRow = ({ children, climb }) => {
  const { colorMode } = useColorMode()
  const currentUserId = useCurrentUser().user?.id
  const { ascents, error: errorAscents } = useAscents({ climb_id: climb.id })
  if (ascents === undefined || errorAscents || colorMode === undefined) {
    return null
  }
  const isTicked =
    ascents.filter((ascent) => ascent.user_id === currentUserId).length >= 1
  return (
    <Tr
      key={climb.id}
      background={
        isTicked &&
        (colorMode === 'light' ? 'rgba(0, 100, 20, 0.2)' : 'teal.900')
      }
    >
      {children}
    </Tr>
  )
}

const ColumnHeading = ({ children, onClick, cursor }) => {
  return (
    <Th fontSize="15px" onClick={onClick} cursor={cursor}>
      {children}
    </Th>
  )
}

const SortableColumn = ({
  name,
  sortKey,
  currentSortKey,
  setSortKey,
  currentSortAscending,
  setSortAscending,
}) => {
  return (
    <ColumnHeading
      onClick={() => {
        if (currentSortKey === sortKey) {
          if (currentSortAscending !== defaultSortAscending) {
            setSortKey(null)
            setSortAscending(defaultSortAscending)
          } else {
            setSortAscending(!defaultSortAscending)
          }
        } else {
          setSortKey(sortKey)
          setSortAscending(defaultSortAscending)
        }
      }}
      cursor="pointer"
    >
      {name}&nbsp;
      {sortKey === currentSortKey ? (
        currentSortAscending ? (
          <TriangleUpIcon aria-label="sorted descending" />
        ) : (
          <TriangleDownIcon aria-label="sorted ascending" />
        )
      ) : (
        <TriangleUpIcon visibility="hidden" />
      )}
    </ColumnHeading>
  )
}

const sortField = (climb, sortKey, gradeMap) => {
  if (sortKey === 'name') {
    return mostVoted(climb.name_votes)
  }
  if (sortKey === 'grade') {
    // TODO: should be average grade, not most voted
    return gradeMap[climb.most_voted_grade]?.fuzzyUnifiedRank
  }
  if (sortKey === 'rating') {
    return climb.average_rating
  }
  if (sortKey === 'type') {
    return mostVoted(climb.climb_type_votes)
  }
}

const NameCell = ({ climb }) => {
  const { sector, error } = useSector(climb.sector_id)
  if (sector === undefined || error) {
    return null
  }
  return (
    <Td>
      <HStack>
        <Link
          fontWeight="600"
          color={linkColor}
          href={`/crags/${climb.crag_id}/sectors/${sector.id}/climbs/${climb.id}`}
        >
          {mostVoted(climb.name_votes)}
        </Link>{' '}
        <ClimbTagIcons climb={climb} />
      </HStack>
    </Td>
  )
}

const ClimbTagIcons = ({ climb }) => {
  const { betaVideos, error: errorBetaVideos } = useBetaVideos({
    climb_id: climb.id,
  })
  const { comments, error: errorComments } = useComments(climb.id)
  return (
    <HStack>
      {comments !== undefined && comments.length >= 1 ? (
        <FaCommentDots
          color="#3182CE"
          title={
            comments.length >= 2
              ? `${comments.length} comments`
              : `${comments.length} comment`
          }
        />
      ) : (
        ''
      )}
      {betaVideos !== undefined && betaVideos.length >= 1 ? (
        <FaVideo
          color="#38A169"
          title={
            betaVideos.length >= 2
              ? `${betaVideos.length} beta videos`
              : `${betaVideos.length} beta video`
          }
        />
      ) : (
        ''
      )}
      {climb.broken_votes !== undefined && climb.broken_votes.length >= 1 ? (
        <FaHeartBroken
          color="#FF6B6B"
          title={`${climb.broken_votes.length} voted broken`}
        />
      ) : (
        ''
      )}
    </HStack>
  )
}

const RatingCell = ({ climb }) => {
  return (
    <Td>
      {climb.rating_votes.length >= 1 ? (
        <StarRatings
          rating={climb.average_rating}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starEmptyColor="grey"
          starDimension="20px"
          starSpacing="0px"
        />
      ) : (
        'No votes yet'
      )}
    </Td>
  )
}

const AscentsCell = ({ climb }) => {
  const { ascents, error: errorAscents } = useAscents({ climb_id: climb.id })
  return (
    <Td>{ascents !== undefined && ascents.length > 0 ? ascents.length : 0}</Td>
  )
}

const ClimbTypeCell = ({ climb }) => {
  const climbType = mostVoted(climb.climb_type_votes)
  return (
    <Td>
      {(climbType !== undefined) & (climbType !== null)
        ? climbType.value
        : 'No votes yet'}
    </Td>
  )
}

const SectorCell = ({ climb }) => {
  const { sector, error } = useSector(climb.sector_id)
  if (sector === undefined || error) {
    return null
  }
  return (
    <Td>
      <Link
        fontWeight="600"
        color={linkColor}
        href={`/crags/${climb.crag_id}/sectors/${sector.id}`}
      >
        {mostVoted(sector.name_votes)}
      </Link>{' '}
    </Td>
  )
}
