import { ChakraProvider } from '@chakra-ui/react'
import { Route, Switch } from 'react-router'
import { ParallaxProvider } from 'react-scroll-parallax'
import { SWRConfig } from 'swr'
import { NavBar } from './components/navbar.js'
import AddAscent from './pages/add-ascent'
import AddBetaVideo from './pages/add-beta-video'
import AddClimb from './pages/add-climb.js'
import AddCragPhoto from './pages/add-crag-photo'
import AddCrag from './pages/add-crag.js'
import AddImage from './pages/add-image.js'
import AddLine from './pages/add-line.js'
import AddSector from './pages/add-sector.js'
import Area from './pages/area'
import Climb from './pages/climb.js'
import CragList from './pages/crag-list'
import CragPhoto from './pages/crag-photo'
import Crag from './pages/crag/index.js'
import Crags from './pages/crags.js'
import FeedPage from './pages/feedpage'
import FilterSearch from './pages/filter-search'
import RockImage from './pages/image.js'
import Landing from './pages/landing.js'
import Line from './pages/line.js'
import Map from './pages/map'
import Sector from './pages/sector/index.js'
import Settings from './pages/settings.js'
import UserPhotos from './pages/user-photos'
import UserProfile from './pages/user-profile'
import UserTicks from './pages/user-ticks'
import VoteAccessInformation from './pages/vote-access-information'
import VoteBanner from './pages/vote-banner'
import VoteClimbBroken from './pages/vote-climb-broken'
import VoteClimbDescription from './pages/vote-climb-description'
import VoteClimbGrade from './pages/vote-climb-grade.js'
import VoteClimbName from './pages/vote-climb-name.js'
import VoteCragDescription from './pages/vote-crag-description'
import VoteCragName from './pages/vote-crag-name.js'
import VoteRating from './pages/vote-rating'
import VoteSectorCoordinates from './pages/vote-sector-coordinates'
import VoteSectorName from './pages/vote-sector-name.js'
import theme from './styles/theme'

function App() {
  return (
    <SWRConfig>
      <ChakraProvider resetCSS theme={theme}>
        <NavBar />
        <ParallaxProvider>
          <Switch>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/crags">
              <Crags />
            </Route>
            <Route path="/areas/">
              <Area />
            </Route>
            <Route path="/search">
              <FilterSearch />
            </Route>
            <Route path="/map">
              <Map />
            </Route>
            <Route path="/feed">
              <FeedPage />
            </Route>
            <Route exact path="/crags/:cragId?">
              <Crag />
            </Route>
            <Route exact path="/crags/:cragId?/list">
              <CragList />
            </Route>
            <Route exact path="/user/:userId?">
              <UserProfile />
            </Route>
            <Route path="/user/:userId?/ticks">
              <UserTicks />
            </Route>
            <Route path="/user/:userId?/photos">
              <UserPhotos />
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
            <Route exact path="/crags/:cragId?/crag-photo/:cragPhotoId?">
              <CragPhoto />
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
              path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/vote-description"
            >
              <VoteClimbDescription />
            </Route>
            <Route
              exact
              path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/vote-climb-broken"
            >
              <VoteClimbBroken />
            </Route>
            <Route
              exact
              path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/add-beta-video"
            >
              <AddBetaVideo />
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
            <Route
              exact
              path="/crags/:cragId?/sectors/:sectorId?/lines/:lineId?"
            >
              <Line />
            </Route>
            <Route
              exact
              path="/crags/:cragId?/sectors/:sectorId?/climbs/:climbId?/add-ascent"
            >
              <AddAscent />
            </Route>
            <Route path="/">
              <Landing />
            </Route>
          </Switch>
        </ParallaxProvider>
      </ChakraProvider>
    </SWRConfig>
  )
}

export default App
