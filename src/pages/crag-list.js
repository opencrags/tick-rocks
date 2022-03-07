import { useState } from 'react'
import { Table, Tbody, Td, Th, Thead, Tr, Link } from '@chakra-ui/react'
import { CragBanner, CragBannerMenu } from '../components/crag-banner'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex, LinkBox, Heading, Text } from '@chakra-ui/layout'
import { Link as RouterLink, useParams } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  useCrag,
  mostVoted,
  useClimbs,
  useGradeSystemGrades,
  useSector,
  useAscents,
} from '../utils/backend'

const defaultSortAscending = false

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
        >
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: '100%' }}
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
    return null // todo: return a loader
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
          <Th>Ascents</Th>
          <Th>Sector</Th>
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
            <Tr key={climb.id}>
              <NameCell climb={climb} />
              <Td>{gradeMap[climb.most_voted_grade]?.grade}</Td>
              <RatingCell climb={climb} />
              <AscentsCell climb={climb} />
              <SectorCell climb={climb} />
            </Tr>
          ))}
      </Tbody>
    </Table>
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
    <Th
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
    </Th>
  )
}

const sortField = (climb, sortKey, gradeMap) => {
  if (sortKey === 'name') {
    return mostVoted(climb.name_votes)
  }
  if (sortKey === 'grade') {
    return gradeMap[climb.most_voted_grade].fuzzyUnifiedRank
  }
  if (sortKey === 'rating') {
    return mostVoted(climb.rating_votes)
  }
}

const NameCell = ({ climb }) => {
  const { sector, error } = useSector(climb.sector_id)
  if (sector === undefined || error) {
    return null
  }
  return (
    <Td>
      <Link
        fontWeight="600"
        color="blue.400"
        href={`/crags/${climb.crag_id}/sectors/${sector.id}/climbs/${climb.id}`}
      >
        {mostVoted(climb.name_votes)}
      </Link>{' '}
    </Td>
  )
}

const RatingCell = ({ climb }) => {
  console.log(climb)
  return (
    <Td>
      {climb.rating_votes.length >= 1 ? (
        <StarRatings
          rating={mostVoted(climb.rating_votes)}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starEmptyColor="gray"
          starDimension="20px"
        />
      ) : (
        'No rating votes'
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

const SectorCell = ({ climb }) => {
  const { sector, error } = useSector(climb.sector_id)
  if (sector === undefined || error) {
    return null
  }
  return (
    <Td>
      <Link
        fontWeight="600"
        color="blue.400"
        href={`/crags/${climb.crag_id}/sectors/${sector.id}`}
      >
        {mostVoted(sector.name_votes)}
      </Link>{' '}
    </Td>
  )
}
