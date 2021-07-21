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
import Loader from "./loader.js";
import { useCrag, useSector, useClimb } from "../utils/backend.js";

export default function Climb(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const climbId = props.match.params.climbId;
  const { crag, error: errorCrag } = useCrag(cragId);
  const { sector, error: errorSector } = useSector(sectorId);
  const { climb, error: errorClimb } = useClimb(climbId);

  if (errorCrag || errorSector || errorClimb) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load climb.</Text>
        </Center>
      </Container>
    );
  }

  if (crag === undefined || sector === undefined || climb === undefined) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="sm">{crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="md">{sector.name_votes[0].value}</Heading>
      </Link>
      <Heading>{climb.name_votes[0].value}</Heading>
    </Container>
  );
}
