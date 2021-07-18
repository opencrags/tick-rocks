import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  useColorModeValue,
  Link,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";

export function NavBar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <Box bg={useColorModeValue("brand.100", "gray.900")} px={4}>
      <Flex>
        {/* <Box>
          <Center height="80px" width="180px">
            <Heading size="sm">Tick Rocks</Heading>
          </Center>
        </Box> */}
        <Box>
          <Center height="80px">
            <Image src="/favicon-64.png" />
            <Heading size="sm" color="brand.200">Tick Rocks</Heading>
          </Center>
        </Box>
        <Spacer />
        <Box>
          <Center height="80px" marginRight="20px">
            <Heading size="sm">
              <Link as={RouterLink} to="/">
                Landing
              </Link>
            </Heading>
          </Center>
        </Box>
        <Box>
          <Center height="80px" marginRight="20px">
            <Heading size="sm">
              <Link as={RouterLink} to="/crags">
                Crags
              </Link>
            </Heading>
          </Center>
        </Box>
        <Box>
          <Center height="80px" marginRight="20px">
            <Heading size="sm">
              <Link as={RouterLink} to="/add-crag">
                Add crag
              </Link>
            </Heading>
          </Center>
        </Box>
        {isAuthenticated ? (
          <Box>
            <Center height="80px" marginRight="20px">
              <Heading size="sm">
                <Link href="" onClick={logout}>
                  Logout
                </Link>
              </Heading>
            </Center>
          </Box>
        ) : (
          <Box>
            <Center height="80px" marginRight="20px">
              <Heading size="sm" _hover={{ cursor: "pointer" }}>
                <Link
                  onClick={() =>
                    loginWithRedirect({
                      appState: {
                        returnTo: window.location.pathname,
                      },
                    })
                  }
                >
                  Login
                </Link>
              </Heading>
            </Center>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
