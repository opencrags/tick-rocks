import { useAuth0 } from '@auth0/auth0-react'
import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Image,
  HStack,
  show,
  Text,
  Avatar,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Input,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import React from 'react'
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons'

export function NavBar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const btnRef = React.useRef()
  const MenuItems = (props) => {
    const { children, isLast, to = '/', ...rest } = props
    return (
      <Box
        as={RouterLink}
        to={to}
        _hover={{
          background: '#3CAB70',
        }}
        color="white"
        width="100%"
        minWidth="100px"
        pt="4"
        pb="4"
        paddingRight={{ base: 0, sm: 1 }}
        paddingLeft={{ base: 0, sm: 1 }}
        fontWeight="semibold"
      >
        <Center>{children}</Center>
      </Box>
    )
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  function SearchModal() {
    return (
      <>
        <Box height={{ base: '100%', md: '10' }}>
          <SearchIcon
            display={{ base: 'block', md: 'none' }}
            color="white"
            h={8}
            w={8}
            paddingRight="10px"
            height="100%"
            onClick={onOpen}
          />
          <Input
            onClick={onOpen}
            border="none"
            alignSelf="flex-start"
            isReadOnly={true}
            placeholder="Search crags, routes, climbers, etc."
            display={{ base: 'none', md: 'block' }}
            background="gray.600"
            color="brand.100"
            minW={{ sm: '10vw', md: '12vw', lg: '350px' }}
          />
          <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay marginTop={{ base: '0px', md: '0px' }} />
            <ModalContent
              backgroundColor="brand.100"
              marginTop={{ base: '0px', sm: '10vh' }}
            >
              <ModalBody>
                <Flex>
                  <SearchIcon color="gray.300" w={5} h={5} margin="15px" />
                  <Input
                    color="gray.300"
                    variant="unstyled"
                    placeholder="Search crags, routes, climbers, etc."
                  />
                </Flex>
                <ModalCloseButton
                  display={{ base: 'block', sm: 'none' }}
                  color="white"
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </>
    )
  }

  function MenuDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <HamburgerIcon
          onClick={onOpen}
          w="38px"
          paddingLeft="10px"
          height="100%"
          ref={btnRef}
          display={{ base: 'block', md: 'none', lg: 'none' }}
          color="white"
        />
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent background="brand.100">
            <DrawerBody padding="0px">
              <Flex direction="column" mt="20px" onClick={onClose}>
                <HStack>
                  <HamburgerIcon
                    onClick={onOpen}
                    display={{ base: 'block', xs: 'none', lg: 'none' }}
                    paddingLeft="10px"
                    w="38px"
                    h="30px"
                    color="white"
                  />
                  <Box h="35px" w="50px" mr="10px">
                    <svg
                      data-name="Lager 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 194.5 130.5"
                    >
                      <path
                        d="M131 0L93 5a25 25 0 00-5 1L52 18a25 25 0 00-12 9L5 72a25 25 0 001 32l13 16a25 25 0 0019 9l106 1a25 25 0 0010-1l21-9a25 25 0 0015-20l4-40a25 25 0 00-8-21L151 7a25 25 0 00-20-7z"
                        fill="#3CAB70"
                        data-name="Lager 2"
                      />
                      <path
                        d="M67 116a6 6 0 01-6 4h0-18a20 20 0 01-15-7l-10-12a21 21 0 010-26l27-35c1-2 5-6 7-6 3 0 4 5 3 7l-1 6-4 20a8 8 0 002 7l17 17a6 6 0 012 5z"
                        stroke="#3CAB70"
                        strokeWidth="4"
                        fill="#fff"
                        strokeMiterlimit="10"
                        data-name="Lager 3"
                      />
                      <path
                        d="M164 43l-7-6a3 3 0 00-4-1l-50 50a3 3 0 01-4 0L74 61a3 3 0 00-4 0l-7 7a3 3 0 000 5l36 35a3 3 0 004 1l61-61a3 3 0 000-5z"
                        fill="#fff"
                        data-name="Lager 5"
                      />
                    </svg>
                  </Box>
                  <Heading width="150px" size="sm" color="white">
                    tick.rocks
                  </Heading>
                </HStack>

                <MenuItems to="/map">Map</MenuItems>
                <MenuItems to="/crags">Crags</MenuItems>
                <MenuItems to="/add-crag">Add crag</MenuItems>
                <MenuDivider />
                {isAuthenticated ? (
                  <>
                    <MenuItems to="/user-profile">
                      <Avatar name="Rasmus Eriksson" src="..." size="xs" />
                      <Text marginLeft="3">Rasmus Eriksson</Text>
                    </MenuItems>
                    <MenuItems to="/ticklist">Ticklist</MenuItems>
                    <MenuItems to="/settings">Settings</MenuItems>
                    <Box
                      onClick={logout}
                      _hover={{
                        background: '#3CAB70',
                      }}
                      color="White"
                      width="100%"
                      minWidth="100px"
                      fontWeight="semibold"
                      pt="5"
                      pb="5"
                    >
                      <Center>Sign Out</Center>
                    </Box>
                  </>
                ) : (
                  <Box
                    onClick={() =>
                      loginWithRedirect({
                        appState: { returnTo: window.location.pathname },
                      })
                    }
                    _hover={{
                      background: '3CAB70',
                      color: 'White',
                    }}
                    width="100%"
                    minWidth="100px"
                    fontWeight="semibold"
                    pt="5"
                    pb="5"
                  >
                    <Center>Sign in</Center>
                  </Box>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Box>
      <Box h="57px" display={{ base: 'block', md: 'none' }} />
      <Flex
        as="nav"
        pl={{ xxl: '14vw', xl: '80px', md: '5vw', base: '0px' }}
        pr={{ xxl: '14vw', xl: '80px', md: '5vw', base: '0px' }}
        align="center"
        justify="space-between"
        width="100%"
        height="57px"
        bg="gray.700"
        color="White"
        position={{ base: 'fixed', md: 'relative' }}
        zIndex="docked"
        top="0px"
        boxShadow="0px 12px 18px -20px rgba(0, 0, 0, 0.5)"
      >
        <MenuDrawer />
        <Flex as={RouterLink} to="/" align="center">
          <Box h="35px" w="50px" mr="10px">
            <svg
              data-name="Lager 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 194.5 130.5"
            >
              <path
                d="M131 0L93 5a25 25 0 00-5 1L52 18a25 25 0 00-12 9L5 72a25 25 0 001 32l13 16a25 25 0 0019 9l106 1a25 25 0 0010-1l21-9a25 25 0 0015-20l4-40a25 25 0 00-8-21L151 7a25 25 0 00-20-7z"
                fill="#3CAB70"
                data-name="Lager 2"
              />
              <path
                d="M67 116a6 6 0 01-6 4h0-18a20 20 0 01-15-7l-10-12a21 21 0 010-26l27-35c1-2 5-6 7-6 3 0 4 5 3 7l-1 6-4 20a8 8 0 002 7l17 17a6 6 0 012 5z"
                stroke="#3CAB70"
                strokeWidth="4"
                fill="#fff"
                strokeMiterlimit="10"
                data-name="Lager 3"
              />
              <path
                d="M164 43l-7-6a3 3 0 00-4-1l-50 50a3 3 0 01-4 0L74 61a3 3 0 00-4 0l-7 7a3 3 0 000 5l36 35a3 3 0 004 1l61-61a3 3 0 000-5z"
                fill="#fff"
                data-name="Lager 5"
              />
            </svg>
          </Box>

          <Heading
            width="150px"
            size="sm"
            color="white"
            display={{ base: 'none', md: 'flex' }}
          >
            tick.rocks
          </Heading>
        </Flex>
        <SearchModal />
        <Spacer display={{ base: 'none', md: 'block' }} />
        <Box
          display={{ base: show ? 'block' : 'none', md: 'block' }}
          flexBasis={{ base: '100%', md: 'auto' }}
        >
          <Flex
            align="center"
            justify={['center', 'space-between', 'flex-end', 'flex-end']}
            direction={['column', 'row', 'row', 'row']}
          >
            <MenuItems to="/map">Map</MenuItems>
            <MenuItems to="/crags">Crags</MenuItems>
            <MenuItems to="/add-crag">Add crag</MenuItems>
            {isAuthenticated ? (
              <Menu>
                <Avatar
                  as={MenuButton}
                  display={{ base: 'none', md: 'block' }}
                  margin="5"
                  name="Rasmus Eriksson"
                  src="..."
                  size="xs"
                ></Avatar>
                <MenuList>
                  <MenuItem as={RouterLink} to="/user-profile">
                    Rasmus Eriksson
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/ticklist">
                    Ticklist{' '}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem as={RouterLink} to="/settings">
                    Settings
                  </MenuItem>
                  <MenuItem onClick={logout}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <MenuItems to="/">
                <Text
                  onClick={() =>
                    loginWithRedirect({
                      appState: { returnTo: window.location.pathname },
                    })
                  }
                >
                  Sign in
                </Text>
              </MenuItems>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
