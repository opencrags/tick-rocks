import { Tooltip } from '@chakra-ui/tooltip'
import { WarningTwoIcon } from '@chakra-ui/icons'
import { conflicting } from '../utils/backend.js'

export default function VoteConflictWarning({ votes }) {
  return conflicting(votes) ? (
    <Tooltip label="There are conflicting votes">
      <WarningTwoIcon variant="ghost" color="yellow.600" fontSize="md" />
    </Tooltip>
  ) : (
    ''
  )
}
