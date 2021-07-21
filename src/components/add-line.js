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
import { Link as RouterLink, useHistory } from "react-router-dom";
import Loader from "./loader.js";
import { useAuthorizedFetcher, useClimbs } from "../utils/backend.js";

export default function AddLine(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const imageId = props.match.params.imageId;
  const history = useHistory();
  const { authorizedFetcher, error } = useAuthorizedFetcher();
  const { climbs, error: errorClimbs } = useClimbs(
    { sector_id: sectorId },
    100
  );
  const [climbId, setClimbId] = useState("");
  const [linePath, setLinePath] = useState("");

  const addLine = () =>
    authorizedFetcher("/lines", {
      method: "POST",
      body: JSON.stringify({
        sector_id: sectorId,
        image_id: imageId,
        climb_id: climbId,
      }),
    });

  const voteLinePath = (lineId) =>
    authorizedFetcher(`/lines/${lineId}/line_path_votes`, {
      method: "POST",
      body: JSON.stringify({
        value: linePath,
        public: true,
      }),
    });

  const navigateToAddedLine = (lineId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/lines/${lineId}`);

  const handleSubmit = () =>
    addLine().then((line) =>
      voteLinePath(line.id).then((_) => navigateToAddedLine(line.id))
    );

  if (error) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
        </Center>
      </Container>
    );
  }

  if (!authorizedFetcher || !climbs) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="container.md">
      <Heading>Add line</Heading>
      <FormControl isRequired>
        <FormLabel>Climb</FormLabel>
        <Select
          placeholder="Select climb"
          onChange={(event) => setClimbId(event.target.value)}
        >
          {climbs.map((climb) => (
            <option key={climb.id} value={climb.id}>
              {climb.name_votes[0].value}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Line path</FormLabel>
        <Input
          placeholder="..."
          onChange={(event) => setLinePath(event.target.value)}
        />
      </FormControl>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
}
