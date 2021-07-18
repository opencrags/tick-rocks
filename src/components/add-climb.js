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

export default function AddClimb(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const { authorizedFetcher, error } = useAuthorizedFetcher();
  const [climbName, setClimbName] = useState("");

  const voteClimbName = (climbId) =>
    authorizedFetcher(`/climbs/${climbId}/name_votes`, {
      method: "POST",
      body: JSON.stringify({
        value: climbName,
        public: true,
      }),
    });

  const addClimb = () =>
    authorizedFetcher("/climbs", {
      method: "POST",
      body: JSON.stringify({ sector_id: sectorId }),
    }).then((json) => voteClimbName(json["id"]));

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
      <Heading>Add climb</Heading>
      <FormControl isRequired>
        <FormLabel>Climb name</FormLabel>
        <Input
          placeholder="Climb name"
          onChange={(event) => setClimbName(event.target.value)}
        />
      </FormControl>
      <Button onClick={addClimb}>Submit</Button>
    </Container>
  );
}
