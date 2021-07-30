import { Tooltip } from '@chakra-ui/tooltip'
import { WarningTwoIcon } from '@chakra-ui/icons'
import { conflicting } from '../utils/backend.js'

export default function VoteConflictWarning({ votes, anyVotes }) {
  const allVotes = votes ? [votes] : anyVotes

  const conflict = allVotes.map(conflicting).includes(true)

  return conflict ? (
    <Tooltip label="There are conflicting votes">
      <WarningTwoIcon variant="ghost" color="yellow.600" fontSize="md" />
    </Tooltip>
  ) : (
    ''
  )
}
