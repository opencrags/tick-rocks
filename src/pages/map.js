import { useAuth0 } from '@auth0/auth0-react'
import { Box } from '@chakra-ui/react'
import Loader from '../components/loader.js'
import { PageFooter } from '../components/page-footer.js'
import { ParallaxBanner } from 'react-scroll-parallax'
import { TickRocksLogo } from '../components/tick-rocks-logo.js'
import { useDisclosure } from '@chakra-ui/hooks'
import { SearchIcon } from '@chakra-ui/icons'

import { useUser, useQuickSearch, mostVoted } from '../utils/backend'
import { Link as RouterLink } from 'react-router-dom'

export default function Map() {
  return <Box></Box>
}
