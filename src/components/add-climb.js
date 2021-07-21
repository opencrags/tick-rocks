import {
  Container,
  Center,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "./loader.js";
import { useAuthorizedFetcher } from "../utils/backend.js";

export default function AddClimb(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const history = useHistory();
  const { authorizedFetcher, isAuthenticated, isLoading, error } =
    useAuthorizedFetcher();
  const [climbName, setClimbName] = useState("");

  const addClimb = () =>
    authorizedFetcher("/climbs", {
      method: "POST",
      body: JSON.stringify({ crag_id: cragId, sector_id: sectorId }),
    });

  const voteClimbName = (climbId) =>
    authorizedFetcher(`/climbs/${climbId}/name_votes`, {
      method: "POST",
      body: JSON.stringify({
        value: climbName,
        public: true,
      }),
    });

  const navigateToAddedClimb = (climbId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/climbs/${climbId}`);

  const handleSubmit = () =>
    addClimb().then((climb) =>
      voteClimbName(climb.id).then((_) => navigateToAddedClimb(climb.id))
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

  if (!authorizedFetcher && !isLoading) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">You need to login to add stuff and vote.</Text>
        </Center>
      </Container>
    );
  }

  if (!authorizedFetcher && isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="container.md">
      <Heading>Add climb</Heading>
      <FormControl isRequired>
        <FormLabel>Climb name</FormLabel>
        <Input
          placeholder="Climb name"
          onChange={(event) => setClimbName(event.target.value)}
        />
      </FormControl>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
}
