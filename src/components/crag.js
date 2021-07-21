import { useAuth0 } from "@auth0/auth0-react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  Container,
  Center,
  Heading,
  HStack,
  Link,
  Textarea,
  Spinner,
  Tag,
  TagLabel,
  Select,
  VStack,
  Tooltip,
  Box,
  List,
  Badge,
  Checkbox,
  Text,
  useTab,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useSwr from "swr";
import Loader from "./loader.js";
import { useCrag, useSectors } from "../utils/backend.js";

export default function Crag(props) {
  const cragId = props.match.params.cragId;
  const { crag, error: errorCrag } = useCrag(cragId);
  const { sectors, error: errorSectors } = useSectors({ crag_id: cragId }, 100);

  if (errorCrag || errorSectors) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load crag.</Text>
        </Center>
      </Container>
    );
  }

  if (crag === undefined || sectors === undefined) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="container.md">
      <Heading>{crag.name_votes[0].value}</Heading>
      <Heading size="sm">Sectors</Heading>
      <UnorderedList>
        {sectors
          .filter((sector) => sector.name_votes.length >= 1)
          .map((sector) => (
            <ListItem key={sector.id}>
              <Link
                as={RouterLink}
                to={`/crags/${crag.id}/sectors/${sector.id}`}
              >
                <Text>{sector.name_votes[0].value}</Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
      <Link as={RouterLink} to={`/crags/${crag.id}/add-sector`}>
        <Text>Add sector</Text>
      </Link>
    </Container>
  );
}
