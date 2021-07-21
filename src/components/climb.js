import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  VStack,
  Image,
  Box,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Loader from "./loader.js";
import { useCrag, useSector, useClimb, useLines, useImage } from "../utils/backend.js";

export default function Climb(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const climbId = props.match.params.climbId;
  const { crag, error: errorCrag } = useCrag(cragId);
  const { sector, error: errorSector } = useSector(sectorId);
  const { climb, error: errorClimb } = useClimb(climbId);
  const { lines, error: errorLines } = useLines(
    climbId ? { climb_id: climbId } : null
  );

  if (errorCrag || errorSector || errorClimb) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load climb.</Text>
        </Center>
      </Container>
    );
  }

  if (crag === undefined || sector === undefined || climb === undefined) {
    return <Loader />;
  }

  return (
    <Container maxWidth="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="sm">Crag: {crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="sm">Sector: {sector.name_votes[0].value}</Heading>
      </Link>
      <Heading size="md">{climb.name_votes[0].value}</Heading>
      <VStack>
        {lines.map((line) => (
          <Line crag={crag} sector={sector} climb={climb} line={line} />
        ))}
      </VStack>
    </Container>
  );
}

function Line(props) {
  const line = props.line;
  const { image, error: errorImage } = useImage(line.image_id);

  if (errorImage) {
    return (
      <Center>
        <Text margin="20px">Failed to load image.</Text>
      </Center>
    );
  }

  if (image === undefined) {
    return <Loader />;
  }

  return (
    <Box>
      <Link
        as={RouterLink}
        to={`/crags/${props.crag.id}/sectors/${props.sector.id}/lines/${line.id}`}
      >
        <Heading size="sm">{line.id}</Heading>
      </Link>
      <Image src={image.base64_image} maxWidth="100%" maxHeight="600px" />
      <Text>Line path: {line.line_path_votes[0].value}</Text>
    </Box>
  );
}
