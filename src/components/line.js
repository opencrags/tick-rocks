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
  Image,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useSwr from "swr";
import { useBackend } from "../utils/backend.js";

export default function Line(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const lineId = props.match.params.lineId;
  const { data: crag, error: errorCrag } = useBackend(`/crags/${cragId}`);
  const { data: sector, error: errorSector } = useBackend(
    `/sectors/${sectorId}`
  );
  const { data: line, error: errorLine } = useBackend(`/lines/${lineId}`);
  const { data: climb, error: errorClimb } = useBackend(line ? `/climbs/${line.climb_id}` : null);
  const { data: image, error: errorImage } = useBackend(line ? `/images/${line.image_id}` : null);
  

  if (errorCrag || errorSector || errorClimb || errorImage || errorLine) {
    return (
      <Container maxW="container.md">
        <Center>
          <Text margin="20px">Failed to load line.</Text>
        </Center>
      </Container>
    );
  }

  if (
    crag === undefined ||
    sector === undefined ||
    climb === undefined ||
    image === undefined ||
    line === undefined
  ) {
    return (
      <Container maxW="container.md">
        <Center>
          <Spinner margin="20px" />
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="sm">Crag: {crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="sm">Sector: {sector.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climb.id}`}>
        <Heading size="sm">Climb: {climb.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}`}>
        <Heading size="sm">Image: {image.id}</Heading>
      </Link>
      <Image src={image.base64_image} maxWidth="100%" maxHeight="600px" />
      <Text>Line path: {line.line_path_votes[0].value}</Text>
    </Container>
  );
}
