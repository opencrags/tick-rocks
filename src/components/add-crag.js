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

export default function AddCrag() {
  const { authorizedFetcher, error } = useAuthorizedFetcher();
  const [cragName, setCragName] = useState("");

  const voteCragName = (cragId) =>
    authorizedFetcher(`/crags/${cragId}/name_votes`, {
      method: "POST",
      body: JSON.stringify({
        value: cragName,
        public: true,
      }),
    });

  const addCrag = () =>
    authorizedFetcher("/crags", {
      method: "POST",
      body: JSON.stringify({}),
    }).then((json) => voteCragName(json["id"]));

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
      <Heading>Add crag</Heading>
      <FormControl id="crag-name" isRequired>
        <FormLabel>Crag name</FormLabel>
        <Input
          placeholder="Crag name"
          onChange={(event) => setCragName(event.target.value)}
        />
      </FormControl>
      <Button onClick={addCrag}>Submit</Button>
    </Container>
  );
}
