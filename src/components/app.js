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
import Crags from "./crags.js";
import CreateCrag from "./create-crag";

function App() {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <NavBar />
        <Switch>
          <Route path="/crags" component={Crags} />
          <Route path="/create-crag" component={CreateCrag} />
          <Route path="/" component={Landing} />
        </Switch>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
