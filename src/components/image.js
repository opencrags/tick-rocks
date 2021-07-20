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

export default function RockImage(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const imageId = props.match.params.imageId;
  const { data: crag, error: errorCrag } = useBackend(`/crags/${cragId}`);
  const { data: sector, error: errorSector } = useBackend(
    `/sectors/${sectorId}`
  );
  const { data: image, error: errorImage } = useBackend(`/images/${imageId}`);

  if (errorCrag || errorSector || errorImage) {
    return (
      <Container maxW="container.md">
        <Center>
          <Text margin="20px">Failed to load image.</Text>
        </Center>
      </Container>
    );
  }

  if (crag === undefined || sector === undefined || image === undefined) {
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
        <Heading size="sm">{crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="md">{sector.name_votes[0].value}</Heading>
      </Link>
      {/* <Heading>{image.name_votes[0].value}</Heading> */}
      <Image src={image.base64_image} maxWidth="100%" maxHeight="600px" />
    </Container>
  );
}
