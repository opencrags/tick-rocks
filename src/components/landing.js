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
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useSwr from "swr";
import backend, { authorizedFetcher } from "../utils/backend.js";

export default function Landing() {
  return (
    <Container maxW="container.md">
      <Center marginTop="20px">
        <Text>You are logged in.</Text>
      </Center>
    </Container>
  );
}
