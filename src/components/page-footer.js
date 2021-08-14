import {
  Box,
  Link,
  LinkBox,
  LinkOverlay,
  Text,
  Flex,
  HStack,
  Spacer,
  Image,
} from '@chakra-ui/react'
import { CragComponentBox } from './crag-component-box'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { TickRocksLogo } from './tick-rocks-logo'

export function PageFooter() {
  return (
    <Box color="gray.200" bgColor="gray.900" marginTop="10px" minHeight="100%">
      <CragComponentBox>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-evenly"
          padding={8}
        >
          <Flex
            as={RouterLink}
            to="/"
            direction="row"
            align="center"
            flex="0 0 10%"
            marginBottom={{ base: '20px', md: '0px' }}
          >
            <TickRocksLogo /> <Text>tick.rocks</Text>
          </Flex>
          <Spacer />
          <Text
            flex="0 0 50%"
            align="center"
            marginBottom={{ base: '20px', md: '0px' }}
          >
            tick.rocks is an open-source project for creating, finding and
            ticking off climbing problems and routes. Please help us grow by
            adding your local crag, pre-tick a couple of projects and join our
            community.
          </Text>
          <Spacer />
          <Box align="right" flex="0 0 10%">
            <Link href="https://github.com/opencrags/tick-rocks">
              <Image height="40px" src="/github.png" />
            </Link>
          </Box>
        </Flex>
      </CragComponentBox>
    </Box>
  )
}
