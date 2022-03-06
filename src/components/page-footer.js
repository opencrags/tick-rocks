import { Box, Flex, Heading, Image, Link, Spacer, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { TickRocksLogo } from './tick-rocks-logo'

export function PageFooter({ ...props }) {
  return (
    <Box color="gray.200" bgColor="gray.900" {...props}>
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
          flex="0 0 20%"
          marginBottom={{ base: '20px', md: '0px' }}
        >
          <Flex direction="row" align="center" justify="center">
            <TickRocksLogo h="40px" w="55px"></TickRocksLogo>
            <Box color="white">
              <Heading size="lg">tick.rocks</Heading>
              <Text fontSize="xs">open-source climbing</Text>
            </Box>
          </Flex>
        </Flex>
        <Spacer />
        <Text
          flex="0 0 60%"
          align={{ base: 'left', md: 'center' }}
          marginBottom={{ base: '20px', md: '0px' }}
        >
          tick.rocks is an{' '}
          <Link
            textDecor="underline"
            href="https://github.com/opencrags/tick-rocks"
          >
            open-source
          </Link>{' '}
          project for catalogueing, finding and ticking off climbing problems
          and routes. Please help us grow by adding your local crag, pre-tick a
          couple of projects and join our community. tick.rocks is built on top
          of our open climbing database:{' '}
          <Link textDecor="underline" href="https://opencrags.com/">
            opencrags.com
          </Link>
        </Text>
        <Text></Text>
        <Spacer />
        <Flex direction="row" justify="flex-end" flex="0 0 20%">
          {' '}
          <Link href="" margin={0}>
            <Image height="48px" src="/discord.png" />
          </Link>
          <Link href="https://github.com/opencrags/tick-rocks" margin={1}>
            <Image height="40px" src="/github.png" />
          </Link>
          <Link href="https://instagram.com/tick.rocks" margin={1}>
            <Image height="40px" src="/instagram.png" />
          </Link>
        </Flex>
      </Flex>
    </Box>
  )
}
