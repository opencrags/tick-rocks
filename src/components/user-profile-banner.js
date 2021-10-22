import {
  Container,
  Center,
  Heading,
  Link,
  LinkBox,
  Text,
  UnorderedList,
  ListItem,
  Box,
  HStack,
  Image,
  Flex,
  VStack,
  Avatar,
  Spacer,
  IconButton,
  Button,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Loader from '../components/loader.js'
import { useUser } from '../utils/backend.js'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { useCragPhotos } from '../utils/backend.js'
import { PageFooter } from '../components/page-footer.js'
import { StarIcon } from '@chakra-ui/icons'
export default function UserProfileBanner({ userId, ...props }) {
  const bannerColor = useColorModeValue('gray.300', 'gray.800')
  const bg = useColorModeValue('offwhite', 'gray.700')
  const { user, error: erroruser } = useUser(userId)

  return (
    <>
      <Box h="100%">
        <Box>
          <Box h={{ base: '150px', xs: '200px' }} w="100%" position="relative">
            <Image
              src="https://27crags.s3.amazonaws.com/photos/000/213/213830/size_xl-9d8dc766475a.jpg"
              position="absolute"
              filter="grayscale(0.10)"
              height="100%"
              width="100%"
              fit="cover"
              object-position="50% 50%"
            />
            <Box
              position="absolute"
              height="100%"
              width="100%"
              bg="blackAlpha.600"
              textColor="white"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Flex
                pl={{
                  md: '15vw',
                  base: '20px',
                }}
                pr={{
                  md: '15vw',
                  base: '20px',
                }}
                position="relative"
                w="100%"
                justify="space-between"
              >
                <Flex align="center">
                  <Avatar name={user?.display_name} size="xl" mr="10px" />
                  <Heading>{user?.display_name}</Heading>
                </Flex>
                <Box></Box>
                <VStack></VStack>
              </Flex>
            </Box>
            <Box
              position="absolute"
              right={{ base: '20px', md: '15vw' }}
              top="20px"
            >
              <Button colorScheme="yellow">
                <StarIcon />
                <Text mx="4px">Follow</Text>
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          zIndex="1"
          position={{ base: 'relative', md: 'sticky' }}
          top={{ base: '0px', md: '-1px' }}
          bg={bannerColor}
        >
          <Box>
            <Box
              pl={{
                md: '15vw',
                base: '20px',
              }}
              pr={{
                md: '15vw',
                base: '20px',
              }}
            >
              <Flex
                mb="4px"
                mt="0px"
                justify={{ base: 'space-around', md: 'flex-start' }}
                position="relative"
                w="100%"
              >
                <MenuButton to={`/user/${user?.id}`}>Latest updates</MenuButton>
                <MenuButton to={`/user/${user?.id}/ticks`}>
                  Ticks (1234)
                </MenuButton>
                <MenuButton>Pre-ticks (123)</MenuButton>
                <MenuButton to={`/user/${user?.id}/photos`}>
                  Photos (12)
                </MenuButton>
                <Spacer />
                <MenuButton to="/settings">Settings</MenuButton>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

function MenuButton({ children, to, buttonicon, ...props }) {
  return (
    <Box {...props}>
      <LinkBox
        as={RouterLink}
        to={to}
        variant="unstyled"
        fontWeight="normal"
        fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
        letterSpacing="1.5pt"
        _hover={{ color: 'brand.200' }}
        transition="all .1s"
      >
        <Center
          pb="20px"
          pt="20px"
          pr={{ base: '8px', sm: '16px', md: '30px' }}
          height="55px"
        >
          <Text>{children}</Text>
        </Center>
      </LinkBox>
    </Box>
  )
}
