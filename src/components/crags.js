import {
  Container,
  Center,
  Heading,
  HStack,
  Link,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  Box,
  Text,
  StackDivider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Loader from "./loader.js";
import { useCrags, useSectors, useClimbs } from "../utils/backend.js";

export default function Crags() {
  const { crags, error: error } = useCrags({});

  if (error) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load crags.</Text>
        </Center>
      </Container>
    );
  }

  if (crags === undefined) {
    return (
      <Loader />
    );
  }

  if (crags.length == 0) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">There are no crags to show.</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxWidth="container.sm">
      <Center>
        <VStack
          marginTop="20px"
          divider={<StackDivider borderColor="gray.200" />}
          spacing={6}
          alignItems="left"
          width="100%"
        >
          {crags
            .filter((crag) => crag.name_votes.length >= 1)
            .map((crag) => (
              <Crag key={crag.id} crag={crag} />
            ))}
        </VStack>
      </Center>
    </Container>
  );
}

function Crag(props) {
  const cragId = props.crag.id;
  const { sectors, error: errorSectors } = useSectors({ crag_id: cragId });
  const { climbs, error: errorClimbs } = useClimbs({ crag_id: cragId });

  return (
    <Box key={cragId}>
      <VStack alignItems="left">
        <Box>
          <Link as={RouterLink} to={`/crags/${cragId}`}>
            <Heading size="md">{props.crag.name_votes[0].value}</Heading>
          </Link>
          <Skeleton isLoaded={sectors && climbs}>
            <HStack>
              <Stat size="sm">
                <StatLabel>Sectors</StatLabel>
                <StatNumber>{sectors ? sectors.length : "?"}</StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel>Climbs</StatLabel>
                <StatNumber>{climbs ? climbs.length : "?"}</StatNumber>
              </Stat>
            </HStack>
          </Skeleton>
        </Box>
      </VStack>
    </Box>
  );
}
