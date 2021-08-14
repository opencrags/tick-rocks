import { ChakraProvider } from '@chakra-ui/react'
import { Route, Switch } from 'react-router'
import theme from './styles/theme'
import { NavBar } from './components/navbar.js'
import Landing from './pages/landing.js'
import Settings from './pages/settings.js'
import Crags from './pages/crags.js'
import Crag from './pages/crag.js'
import Sector from './pages/sector.js'
import Climb from './pages/climb.js'
import RockImage from './pages/image.js'
import Line from './pages/line.js'
import AddCrag from './pages/add-crag.js'
import AddCragPhoto from './pages/add-crag-photo'
import AddSector from './pages/add-sector.js'
import AddClimb from './pages/add-climb.js'
import AddImage from './pages/add-image.js'
import AddLine from './pages/add-line.js'
import VoteCragName from './pages/vote-crag-name.js'
import VoteAccessInformation from './pages/vote-access-information'
import VoteSectorName from './pages/vote-sector-name.js'
import VoteSectorCoordinates from './pages/vote-sector-coordinates'
import VoteClimbName from './pages/vote-climb-name.js'
import VoteClimbGrade from './pages/vote-climb-grade.js'
import VoteRating from './pages/vote-rating'
import VoteBanner from './pages/vote-banner'
import { ParallaxProvider } from 'react-scroll-parallax'
import FilterSearch from './pages/filter-search'
import VoteCragDescription from './pages/vote-crag-description'
import VoteClimbBetaVideo from './pages/vote-climb-beta-video'
import BetaBar from './components/betabar'
function App() {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <BetaBar />
      <NavBar />
      <ParallaxProvider>
        <Switch>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/crags">
            <Crags />
          </Route>
          <Route exact path="/crags/:cragId?">
            <Crag />
          </Route>
          <Route path="/crags/:cragId?/vote-name">
            <VoteCragName />
          </Route>
          <Route path="/crags/:cragId?/vote-access-information">
            <VoteAccessInformation />
          </Route>
          <Route path="/crags/:cragId?/vote-banner">
            <VoteBanner />
          </Route>
          <Route path="/crags/:cragId?/add-crag-photo">
            <AddCragPhoto />
          </Route>
          <Route path="/crags/:cragId?/vote-crag-description">
            <VoteCragDescription />
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
          <Route
            exact
            path="/crags/:cragId?/sectors/:sectorId?/vote-coordinates"
          >
            <VoteSectorCoordinates />
          </Route>
          <Route exact path="/crags/:cragId?/sectors/:sectorId?/add-climb">
            <AddClimb />
          </Route>
          <Route
            exact
            path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?"
          >
            <Climb />
          </Route>
          <Route
            exact
            path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/vote-name"
          >
            <VoteClimbName />
          </Route>
          <Route
            exact
            path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/vote-grade"
          >
            <VoteClimbGrade />
          </Route>
          <Route
            exact
            path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/vote-rating"
          >
            <VoteRating />
          </Route>
          <Route
            exact
            path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/vote-climb-beta-video"
          >
            <VoteClimbBetaVideo />
          </Route>
          <Route exact path="/crags/:cragId?/sectors/:sectorId?/add-image">
            <AddImage />
          </Route>
          <Route
            exact
            path="/crags/:cragId?/sectors/:sectorId?/images/:imageId?"
          >
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
          <Route path="/search">
            <FilterSearch />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </ParallaxProvider>
    </ChakraProvider>
  )
}

export default App
