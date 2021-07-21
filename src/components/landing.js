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
import { authorizedFetcher } from "../utils/backend.js";

export default function Landing() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <Container maxW="container.md">
        <Center>
          <Spinner margin="20px" />
        </Center>
      </Container>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Container maxW="container.md">
        <Center marginTop="20px">
          <Text>
            You need to{" "}
            <Link
              onClick={() =>
                loginWithRedirect({
                  appState: {
                    returnTo: window.location.pathname,
                  },
                })
              }
              color="teal.500"
            >
              login
            </Link>{" "}
            to add stuff and vote.
          </Text>
        </Center>
      </Container>
    );
  } else {
    return (
      <Container maxW="container.md">
        <Center marginTop="20px">
          <Text>You are logged in.</Text>
        </Center>
      </Container>
    );
  }
}
