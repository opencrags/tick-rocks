import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import MapPopupPortal from '../components/map-popup-portal.js'
import MapPopup from '../components/map-popup.js'
import MapboxMap from '../components/mapbox-map.js'

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
