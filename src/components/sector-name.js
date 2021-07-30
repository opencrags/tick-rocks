import { Heading, Skeleton } from '@chakra-ui/react'

import EditButton from './edit-button.js'
import VoteConflictWarning from './vote-conflict-warning.js'
import { useSector, mostVoted, conflicting } from '../utils/backend.js'

function SectorName({ sectorId }) {
  const { sector, error } = useSector(sectorId)

  if (error) {
    return <>Failed to load sector.</>
  }

  if (sector === undefined) {
    return <Skeleton>?</Skeleton>
  }

  return (
    <>
      {sector.name_votes.length >= 1
        ? mostVoted(sector.name_votes)
        : 'No sector name votes'}
    </>
  )
}

function SectorNameHeading({ sectorId, size }) {
  const { sector, error } = useSector(sectorId)

  if (error) {
    return <>Failed to load sector.</>
  }

  if (sector === undefined) {
    return (
      <Skeleton>
        <Heading>?</Heading>
      </Skeleton>
    )
  }

  return (
    <Heading size={size}>
      {sector.name_votes.length >= 1
        ? mostVoted(sector.name_votes)
        : 'No sector name votes'}
      <EditButton to={`/crags/${sector.crag_id}/sectors/${sectorId}/vote-name`}>
        {conflicting(sector.name_votes) && (
          <VoteConflictWarning votes={sector.name_votes} />
        )}
      </EditButton>
    </Heading>
  )
}

function SectorNameLink({ sectorId, warnAnyConflict }) {
  const { sector, error } = useSector(sectorId)

  if (error) {
    return <>Failed to load sector.</>
  }

  if (sector === undefined) {
    return <Skeleton>?</Skeleton>
  }

  return (
    <>
      {sector.name_votes.length >= 1
        ? mostVoted(sector.name_votes)
        : 'No sector name votes'}
      <VoteConflictWarning />
    </>
  )
}

export { SectorName, SectorNameHeading, SectorNameLink }
