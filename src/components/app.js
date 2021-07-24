import { ChakraProvider } from '@chakra-ui/react'
import { Route, Switch } from 'react-router'
import theme from '../styles/theme'
import { NavBar } from './navbar.js'
import Landing from './landing.js'
import Crags from './crags.js'
import Crag from './crag.js'
import Sector from './sector.js'
import Climb from './climb.js'
import RockImage from './image.js'
import Line from './line.js'
import AddCrag from './add-crag.js'
import AddSector from './add-sector.js'
import AddClimb from './add-climb.js'
import AddImage from './add-image.js'
import AddLine from './add-line.js'
import VoteCragName from './vote-crag-name'
import VoteSectorName from './vote-sector-name'

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
