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
import Loader from "./loader.js";
import { authorizedFetcher } from "../utils/backend.js";

export default function Landing() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <Loader />
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Container maxWidth="container.md">
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
      <Container maxWidth="container.md">
        <Center marginTop="20px">
          <Text>You are logged in.</Text>
        </Center>
      </Container>
    );
  }
}
