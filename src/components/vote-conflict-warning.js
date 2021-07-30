import { Tooltip } from '@chakra-ui/tooltip'
import { WarningTwoIcon } from '@chakra-ui/icons'

export default function VoteConflictWarning() {
  return (
    <Tooltip label="There are conflicting votes">
      <WarningTwoIcon variant="ghost" color="yellow.600" fontSize="md" />
    </Tooltip>
  )
}
