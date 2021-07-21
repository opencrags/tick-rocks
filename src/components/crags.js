import { useAuth0 } from "@auth0/auth0-react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  Container,
  Center,
  Divider,
  Heading,
  HStack,
  Link,
  Textarea,
  Spinner,
  Tag,
  TagLabel,
  Select,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
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
  StackDivider,
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
  const { data: crags, error: error } = useBackend(
    "/crags/query?limit=20&offset=0",
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );

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
    <Container maxWidth="container.sm">
      <Center>
        <VStack
          marginTop="20px"
          divider={<StackDivider borderColor="gray.200" />}
          spacing={6}
          alignItems="left"
          width="100%"
        >
          {crags
            .filter((crag) => crag.name_votes.length >= 1)
            .map((crag) => (
              <Crag key={crag.id} crag={crag} />
            ))}
        </VStack>
      </Center>
    </Container>
  );
}

function Crag(props) {
  const cragId = props.crag.id;
  const { data: sectors, error: errorSectors } = useBackend(
    "/sectors/query?limit=20&offset=0",
    {
      method: "POST",
      body: JSON.stringify({ crag_id: cragId }),
    }
  );

  const { data: climbs, error: errorClimbs } = useBackend(
    "/climbs/query?limit=20&offset=0",
    {
      method: "POST",
      body: JSON.stringify({ crag_id: cragId }),
    }
  );

  return (
    <Box key={cragId}>
      <VStack alignItems="left">
        <Box>
          <Link as={RouterLink} to={`/crags/${cragId}`}>
            <Heading size="md">{props.crag.name_votes[0].value}</Heading>
          </Link>
          <Skeleton isLoaded={sectors && climbs}>
            <HStack>
              <Stat size="sm">
                <StatLabel>Sectors</StatLabel>
                <StatNumber>{sectors ? sectors.length : "?"}</StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel>Climbs</StatLabel>
                <StatNumber>{climbs ? climbs.length : "?"}</StatNumber>
              </Stat>
            </HStack>
          </Skeleton>
        </Box>
      </VStack>
    </Box>
  );
}
