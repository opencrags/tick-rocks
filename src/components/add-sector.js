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
  Input,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useSwr from "swr";
import { useConfig, useToken, useAuthorizedFetcher } from "../utils/backend.js";

export default function AddSector(props) {
  const cragId = props.match.params.cragId;
  const { authorizedFetcher, error } = useAuthorizedFetcher();
  const [sectorName, setSectorName] = useState("");

  const voteSectorName = (sectorId) =>
    authorizedFetcher(`/sectors/${sectorId}/name_votes`, {
      method: "POST",
      body: JSON.stringify({
        value: sectorName,
        public: true,
      }),
    });

  const addSector = () =>
    authorizedFetcher("/sectors", {
      method: "POST",
      body: JSON.stringify({ crag_id: cragId }),
    }).then((json) => voteSectorName(json["id"]));

  if (error) {
    return (
      <Container maxW="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
        </Center>
      </Container>
    );
  }

  if (!authorizedFetcher) {
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
      <Heading>Add sector</Heading>
      <FormControl id="sector-name" isRequired>
        <FormLabel>Sector name</FormLabel>
        <Input
          placeholder="Sector name"
          onChange={(event) => setSectorName(event.target.value)}
        />
      </FormControl>
      <Button onClick={addSector}>Submit</Button>
    </Container>
  );
}
