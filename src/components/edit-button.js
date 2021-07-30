import { IconButton, Icon, LinkBox } from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'

export default function EditButton({ to, children }) {
  return (
    <LinkBox as={RouterLink} to={to}>
      <IconButton
        as="sup"
        size="sm"
        aria-label="Vote for crag name"
        variant="ghost"
        color="gray"
        // marginTop="-12px"
        // marginLeft="-4px"
        margin="-4px"
        isRound={true}
        icon={<Icon as={MdEdit} />}
      />
      {children}
    </LinkBox>
  )
}
