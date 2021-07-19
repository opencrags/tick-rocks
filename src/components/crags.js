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
import {
  authorizedFetcher,
  config,
  fetcher,
  useBackend,
  useConfig,
  useToken,
} from "../utils/backend.js";

export default function Crags() {
  const { data: crags, error: error } = useBackend("/crags/query?limit=20&offset=0", {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (error) {
    return (
      <Container maxW="container.md">
        <Center>
          <Text margin="20px">Failed to load crags.</Text>
        </Center>
      </Container>
    );
  }

  if (crags === undefined) {
    return (
      <Container maxW="container.md">
        <Center>
          <Spinner margin="20px" />
        </Center>
      </Container>
    );
  }

  if (crags.length == 0) {
    return (
      <Container maxW="container.md">
        <Center>
          <Text margin="20px">There are no crags to show.</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.md">
      <UnorderedList>
        {crags
          .filter((crag) => crag.name_votes.length >= 1)
          .map((crag) => (
            <ListItem key={crag.id}>
              <Link as={RouterLink} to={`/crags/${crag.id}`}>
                <Text>{crag.name_votes[0].value}</Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
    </Container>
  );
}
