import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { PageFooter } from '../components/page-footer.js'
import { ParallaxBanner } from 'react-scroll-parallax'
import { TickRocksLogo } from '../components/tick-rocks-logo.js'
import { useDisclosure } from '@chakra-ui/hooks'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import MapboxMap from '../components/mapbox-map.js'
import { useUser, useQuickSearch, mostVoted } from '../utils/backend'
import { Link as RouterLink } from 'react-router-dom'
import MapPopupPortal from '../components/map-popup-portal.js'
import MapPopup from '../components/map-popup.js'

export default function Map() {
  return (
    <>
      <Box position="absolute" top="0px" h="100vh" w="100vw">
        <MapboxMap h="100%" deps="">
          <MapPopupPortal>
            <MapPopup />
          </MapPopupPortal>
        </MapboxMap>
      </Box>
      <Box
        position="fixed"
        top={{ base: 'unset', md: '60px' }}
        bottom={{ base: '10px', md: 'unset' }}
        ml="42%"
      >
        <ButtonGroup>
          <Button colorScheme="twitter">Filters</Button>
          <Button colorScheme="twitter">List</Button>
          <IconButton color="white" colorScheme="brand" icon={<AddIcon />} />
        </ButtonGroup>
      </Box>
    </>
  )
}
