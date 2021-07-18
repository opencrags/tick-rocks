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
import AddCrag from "./add-crag.js";
import AddSector from "./add-sector.js";
import AddClimb from "./add-climb.js";
import Sector from "./sector.js";
import Crag from "./crag.js";

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
          <Route exact path="/crags" component={Crags} />
          <Route exact path="/crags/:cragId?" component={Crag} />
          <Route exact path="/crags/:cragId?/sectors/:sectorId?" component={Sector} />
          <Route exact path="/crags/:cragId?/add-sector" component={AddSector} />
          <Route exact path="/crags/:cragId?/sectors/:sectorId?/add-climb" component={AddClimb} />
          <Route path="/add-crag" component={AddCrag} />
          <Route path="/" component={Landing} />
        </Switch>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
