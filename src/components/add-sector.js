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
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import Loader from "./loader.js";
import React, { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import useSwr from "swr";
import { useConfig, useToken, useAuthorizedFetcher } from "../utils/backend.js";

export default function AddSector(props) {
  const cragId = props.match.params.cragId;
  const { authorizedFetcher, error } = useAuthorizedFetcher();
  const history = useHistory();
  const [sectorName, setSectorName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const addSector = () =>
    authorizedFetcher("/sectors", {
      method: "POST",
      body: JSON.stringify({ crag_id: cragId }),
    });

  const voteSectorName = (sectorId) =>
    authorizedFetcher(`/sectors/${sectorId}/name_votes`, {
      method: "POST",
      body: JSON.stringify({
        value: sectorName,
        public: true,
      }),
    });

  const voteSectorCoordinates = (sectorId) =>
    latitude && longitude &&
    authorizedFetcher(`/sectors/${sectorId}/coordinate_votes`, {
      method: "POST",
      body: JSON.stringify({
        value: [parseFloat(longitude), parseFloat(latitude)],
        public: true,
      }),
    });

  const navigateToAddedSector = (sectorId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}`);

  const handleSubmit = () =>
    addSector().then((sector) =>
      Promise.all([
        voteSectorName(sector.id),
        voteSectorCoordinates(sector.id),
      ]).then((_) => navigateToAddedSector(sector.id))
    );

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
    return <Loader />;
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
      <FormControl id="longitude">
        <FormLabel>Latitude</FormLabel>
        <NumberInput precision={7}>
          <NumberInputField onChange={(event) => setLatitude(event.target.value)} />
        </NumberInput>
      </FormControl>
      <FormControl id="longitude">
        <FormLabel>Longitude</FormLabel>
        <NumberInput precision={7}>
          <NumberInputField onChange={(event) => setLongitude(event.target.value)} />
        </NumberInput>
      </FormControl>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
}
