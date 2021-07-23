import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  UnorderedList,
  ListItem,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Loader from "./loader.js";
import EditButton from "./edit-button.js";
import {
  useCrag,
  useSector,
  useClimbs,
  useImages,
  useLines,
} from "../utils/backend.js";

export default function Sector(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const { crag, error: errorCrag } = useCrag(cragId);
  const { sector, error: errorSector } = useSector(sectorId);
  const { climbs, error: errorClimbs } = useClimbs({ sector_id: sectorId });
  const { images, error: errorImages } = useImages({
    sector_id: sectorId,
  });
  const { lines, error: errorLines } = useLines({ sector_id: sectorId });

  if (errorCrag || errorSector || errorLines) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load sector.</Text>
        </Center>
      </Container>
    );
  }

  if (
    crag === undefined ||
    sector === undefined ||
    climbs === undefined ||
    lines === undefined
  ) {
    return <Loader />;
  }

  return (
    <Container maxWidth="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="lg">
          Crag: {crag.name_votes[0].value}
          <EditButton to={`/crags/${cragId}/vote-name`} />
        </Heading>
      </Link>
      <Heading size="lg">
        Sector:{" "}
        {sector.name_votes.length >= 1
          ? sector.name_votes[0].value
          : "No name votes"}
        <EditButton to={`/crags/${cragId}/sectors/${sectorId}/vote-name`} />
      </Heading>
      {sector.coordinate_votes.length >= 1 && (
        <Heading size="xs">
          Coordinates: {sector.coordinate_votes[0].value[1]},{" "}
          {sector.coordinate_votes[0].value.coordinates[0]}
        </Heading>
      )}
      <Heading size="sm">Climbs</Heading>
      <UnorderedList>
        {climbs
          .filter((climb) => climb.name_votes.length >= 1)
          .map((climb) => (
            <ListItem key={climb.id}>
              <Link
                as={RouterLink}
                to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climb.id}`}
              >
                <Text>{climb.name_votes[0].value}</Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/add-climb`}
      >
        <Button>Add climb</Button>
      </Link>
      <Heading size="sm">Images</Heading>
      <UnorderedList>
        {images &&
          images.map((image) => (
            <ListItem key={image.id}>
              <Link
                as={RouterLink}
                to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}`}
              >
                <Text>{image.id}</Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/add-image`}
      >
        <Button>Add image</Button>
      </Link>
      <Heading size="sm">Lines</Heading>
      <UnorderedList>
        {lines &&
          lines.map((line) => (
            <ListItem key={line.id}>
              <Link
                as={RouterLink}
                to={`/crags/${cragId}/sectors/${sectorId}/lines/${line.id}`}
              >
                <Text>{line.id}</Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
      <Text>Go to an image to add a line.</Text>
    </Container>
  );
}
