import React from 'react'
import {
  Container,
  Center,
  Heading,
  Link,
  LinkBox,
  Text,
  UnorderedList,
  ListItem,
  Box,
  HStack,
  Image,
  Flex,
  VStack,
  Avatar,
  Spacer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import {
  mostVoted,
  useAscents,
  useClimb,
  useCrag,
  useCurrentUser,
  useUser,
} from '../utils/backend.js'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { PageFooter } from '../components/page-footer.js'
import UserProfileBanner from '../components/user-profile-banner.js'
import AscentType from '../components/ascent-type.js'
import Grade from '../components/grade.js'
import { CragComponentBox } from '../components/crag-component-box.js'
import ModalDialog from '../components/modal-dialog.js'
import AddAscent from './add-ascent.js'

export default function UserTicks() {
  const bannerColor = useColorModeValue('gray.300', 'gray.800')
  const { userId } = useParams()
  const { user, error: erroruser } = useUser(userId)
  const { ascents, error: errorAscents } = useAscents({})

  const bg = useColorModeValue('gray.50', 'gray.700')
  const table = useColorModeValue('gray.50', 'gray.600')
  console.log(ascents)

  if (erroruser) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load user.</Text>
        </Center>
      </Container>
    )
  }

  if (ascents === undefined) {
    return <Loader />
  }
  if (ascents === null) {
    return 'No ticks logged yet, get tickin!'
  }

  return (
    <Box h="100%">
      <UserProfileBanner userId={userId} />
      <CragComponentBox py="10px" bg={bg}>
        <Heading mx="25px" my="5px">
          Ticks
        </Heading>
        <Table variant="striped" bg={table}>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Climb</Th>
              <Th>Crag</Th>
              <Th>Grade</Th>
              <Th>Go</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ascents.map((ascent) => (
              <Ascent key={ascent.id} ascent={ascent} />
            ))}
          </Tbody>
        </Table>
      </CragComponentBox>
      <PageFooter />
    </Box>
  )
}

function Ascent({ children, ascent, isLast, to = '/', ...props }) {
  const { climb, error: errorClimb } = useClimb(ascent.climb_id)
  const climbName = mostVoted(climb?.name_votes)
  const { crag, error: errorCrag } = useCrag(climb?.crag_id)
  const cragName = mostVoted(crag?.name_votes)
  const { user } = useUser(ascent.user_id)
  const currentUser = useCurrentUser().user

  if (errorClimb || errorCrag) {
    return ''
  }

  return (
    <Tr fontSize={{ base: '0.8em', md: '1em' }}>
      <Td>{new Date(ascent.ascent_date).toISOString().slice(0, 10)}</Td>
      <Td>
        <Box>
          <Text
            as={RouterLink}
            to={`/crags/${climb?.crag_id}/sectors/${climb?.sector_id}/climbs/${climb?.id}`}
            fontWeight="bold"
          >
            {climbName}
          </Text>{' '}
          <Text fontSize="0.9em">{ascent.description}</Text>
        </Box>
      </Td>
      <Td>
        <Text as={RouterLink} to={`/crags/${climb?.crag_id}`}>
          {cragName}
        </Text>
      </Td>
      <Td>
        <Grade gradeId={climb?.most_voted_grade}></Grade>
      </Td>
      <Td>
        <AscentType ascent={ascent} />
      </Td>

      {currentUser?.id === user?.id ? (
        <Td>
          <Box>
            <Box>
              <ModalDialog
                button={
                  <Box ml="5px">
                    <Button size="xs">Edit</Button>
                  </Box>
                }
              >
                <AddAscent ascent={ascent} />
              </ModalDialog>
            </Box>{' '}
          </Box>
        </Td>
      ) : (
        ''
      )}
    </Tr>
  )
}
