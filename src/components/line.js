import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Loader from "./loader.js";
import { useCrag, useSector, useLine, useClimb, useImage } from "../utils/backend.js";

export default function Line(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const lineId = props.match.params.lineId;
  const { crag, error: errorCrag } = useCrag(cragId);
  const { sector, error: errorSector } = useSector(sectorId);
  const { line, error: errorLine } = useLine(lineId);
  const { climb, error: errorClimb } = useClimb(line ? line.climb_id : null);
  const { image, error: errorImage } = useImage(line ? line.image_id : null);  

  if (errorCrag || errorSector || errorClimb || errorImage || errorLine) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load line.</Text>
        </Center>
      </Container>
    );
  }

  if (
    crag === undefined ||
    sector === undefined ||
    climb === undefined ||
    image === undefined ||
    line === undefined
  ) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="sm">Crag: {crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="sm">Sector: {sector.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}/climbs/${climb.id}`}>
        <Heading size="sm">Climb: {climb.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}/images/${image.id}`}>
        <Heading size="sm">Image: {image.id}</Heading>
      </Link>
      <Image src={image.base64_image} maxWidth="100%" maxHeight="600px" />
      <Text>Line path: {line.line_path_votes[0].value}</Text>
    </Container>
  );
}
