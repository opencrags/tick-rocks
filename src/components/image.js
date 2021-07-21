import {
  Container,
  Center,
  Heading,
  Link,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import Loader from "./loader.js";
import { Link as RouterLink } from "react-router-dom";
import { useCrag, useSector, useImage } from "../utils/backend.js";

export default function RockImage(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const imageId = props.match.params.imageId;
  const { crag, error: errorCrag } = useCrag(cragId);
  const { sector, error: errorSector } = useSector(sectorId);
  const { image, error: errorImage } = useImage(imageId);

  if (errorCrag || errorSector || errorImage) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load image.</Text>
        </Center>
      </Container>
    );
  }

  if (crag === undefined || sector === undefined || image === undefined) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="container.md">
      <Link as={RouterLink} to={`/crags/${cragId}`}>
        <Heading size="md">Crag: {crag.name_votes[0].value}</Heading>
      </Link>
      <Link as={RouterLink} to={`/crags/${cragId}/sectors/${sectorId}`}>
        <Heading size="md">Sector: {sector.name_votes[0].value}</Heading>
      </Link>
      <Image src={image.base64_image} maxWidth="100%" maxHeight="600px" />
      <Link
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}/images/${imageId}/add-line`}
      >
        <Button>Add line</Button>
      </Link>
    </Container>
  );
}
