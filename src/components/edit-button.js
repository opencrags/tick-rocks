import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  UnorderedList,
  ListItem,
  Button,
  IconButton,
  Icon,
  LinkBox,
} from "@chakra-ui/react";
import { MdEdit } from 'react-icons/md';
import { Link as RouterLink } from "react-router-dom";

export default function EditButton(props) {
  return (
    <LinkBox as={RouterLink} to={props.to}>
      <IconButton
        as="sup"
        size="sm"
        aria-label="Vote for crag name"
        variant="ghost"
        color="gray"
        marginTop="-12px"
        marginLeft="-4px"
        isRound={true}
        icon={<Icon as={MdEdit} />}
      />
    </LinkBox>
  );
}
