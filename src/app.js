import { ChakraProvider } from '@chakra-ui/react'
import { Route, Switch } from 'react-router'
import theme from './styles/theme'
import { NavBar } from './components/navbar.js'
import Landing from './pages/landing.js'
import Crags from './pages/crags.js'
import Crag from './pages/crag.js'
import Sector from './pages/sector.js'
import Climb from './pages/climb.js'
import RockImage from './pages/image.js'
import Line from './pages/line.js'
import AddCrag from './pages/add-crag.js'
import AddSector from './pages/add-sector.js'
import AddClimb from './pages/add-climb.js'
import AddImage from './pages/add-image.js'
import AddLine from './pages/add-line.js'
import VoteCragName from './pages/vote-crag-name'
import VoteSectorName from './pages/vote-sector-name'
import VoteClimbName from './pages/vote-climb-name'

function App() {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <NavBar />
      <Switch>
        <Route exact path="/crags">
          <Crags />
        </Route>
        <Route exact path="/crags/:cragId?">
          <Crag />
        </Route>
        <Route path="/crags/:cragId?/vote-name">
          <VoteCragName />
        </Route>
        <Route path="/add-crag">
          <AddCrag />
        </Route>
        <Route exact path="/crags/:cragId?/add-sector">
          <AddSector />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?">
          <Sector />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?/vote-name">
          <VoteSectorName />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?/add-climb">
          <AddClimb />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?">
          <Climb />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/vote-name">
          <VoteClimbName />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?/add-image">
          <AddImage />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?/images/:imageId?">
          <RockImage />
        </Route>
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/images/:imageId?/add-line"
        >
          <AddLine />
        </Route>
        <Route exact path="/crags/:cragId?/sectors/:sectorId?/lines/:lineId?">
          <Line />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </ChakraProvider>
  )
}

export default App
