import { useAuth0 } from '@auth0/auth0-react'
import { Flex, LinkBox, Text } from '@chakra-ui/layout'
import { Link as RouterLink } from 'react-router-dom'
export default function BetaBar() {
  return (
    <LinkBox as={RouterLink} to="/bugreport">
      <Flex
        position={{ base: 'fixed', md: 'relative' }}
        zIndex="overlay"
        top="0px"
        align="center"
        justify="center"
        bgColor="white"
        height="13px"
        width="100%"
      >
        <Text fontSize="xs">
          tick.rocks is currently in it's alpha-version, report bug?
        </Text>
      </Flex>
    </LinkBox>
  )
}
