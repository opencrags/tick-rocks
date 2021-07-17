import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Center,
  ChakraProvider,
  ColorModeProvider,
  Container,
  Link,
  Text,
} from "@chakra-ui/react";
import { Route, Switch } from "react-router";
import theme from "../styles/theme";
import { NavBar } from "./navbar.js";
import Landing from "./landing.js";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <NavBar />
        {isAuthenticated ? (
          <Switch>
            {/* <Route path="/measurements" component={Measurements} /> */}
            <Route path="/" component={Landing} />
          </Switch>
        ) : (
          <Container>
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
        )}
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
