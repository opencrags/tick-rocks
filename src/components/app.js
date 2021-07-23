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
        <Route exact path="/crags" component={Crags} />
        <Route exact path="/crags/:cragId?" component={Crag} />
        <Route path="/crags/:cragId?/vote-name" component={VoteCragName} />
        <Route path="/add-crag" component={AddCrag} />
        <Route exact path="/crags/:cragId?/add-sector" component={AddSector} />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?"
          component={Sector}
        />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/vote-name"
          component={VoteSectorName}
        />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/add-climb"
          component={AddClimb}
        />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?"
          component={Climb}
        />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/add-image"
          component={AddImage}
        />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/images/:imageId?"
          component={RockImage}
        />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/images/:imageId?/add-line"
          component={AddLine}
        />
        <Route
          exact
          path="/crags/:cragId?/sectors/:sectorId?/lines/:lineId?"
          component={Line}
        />
        <Route path="/" component={Landing} />
      </Switch>
    </ChakraProvider>
  )
}

export default App
