import { IconButton, Icon } from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'

export default function EditButton(props) {
  return (
    <IconButton
      size="sm"
      aria-label="Vote for crag name"
      variant="ghost"
      color="gray"
      isRound={true}
      icon={<Icon as={MdEdit} />}
      {...props}
    />
  )
}
