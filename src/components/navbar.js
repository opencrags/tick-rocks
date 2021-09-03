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
  ModalHeader,
  Tag,
  Button,
  UnorderedList,
  ListItem,
  Icon,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Wrap,
  LinkBox,
  Link,
} from '@chakra-ui/react'
import StarRatings from 'react-star-ratings'

import { Link as RouterLink } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { SearchIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useCurrentUser, useQuickSearch, mostVoted } from '../utils/backend'
import Grade from '../components/grade'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { TickRocksLogo } from './tick-rocks-logo'
import { ClimbBreadcrumb, CragBreadcrumb, SectorBreadcrumb } from './breadcrumb'
import AddCragModal from './modal-dialog'
import { BoxZoomHandler } from 'mapbox-gl'
import ModalDialog from './modal-dialog'
import AddCrag from '../pages/add-crag'

export function NavBar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const { user } = useCurrentUser()
  const btnRef = React.useRef()
  const { colorMode, toggleColorMode } = useColorMode()

  const buttonColor = useColorModeValue('white', 'gold')
  const MenuItems = ({ children, isLast, to = '/', ...props }) => {
    return (
      <Box
        as={RouterLink}
        to={to}
        _hover={{
          background: 'brand.300',
        }}
        color="white"
        width="100%"
        minWidth="100px"
        pt="4"
        pb="4"
        paddingRight={{ base: 0, sm: 1 }}
        paddingLeft={{ base: 0, sm: 1 }}
        fontWeight="semibold"
        {...props}
      >
        <Center>{children}</Center>
      </Box>
    )
  }
  const PhoneMenuItems = ({ children, isLast, to = '/', ...props }) => {
    return (
      <Box
        as={RouterLink}
        to={to}
        _hover={{
          background: 'brand.300',
        }}
        color="white"
        width="100%"
        minWidth="100px"
        pt="4"
        pb="4"
        paddingRight={{ base: 0, sm: 1 }}
        paddingLeft={{ base: 0, sm: 1 }}
        fontWeight="semibold"
        {...props}
      >
        <Box pl="50px">{children} </Box>
      </Box>
    )
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  function SearchModal() {
    const [searchText, setSearchText] = useState(null)
    const { quickSearch, error: errorQuickSearch } = useQuickSearch(searchText)
    const [oldQuickSearch, setOldQuickSearch, link, displayName] =
      useState(undefined)
    useEffect(() => {
      if (quickSearch !== undefined && quickSearch.length >= 1) {
        setOldQuickSearch(quickSearch)
      }
    }, [quickSearch])
    const QuickSearchResults = ({ quickSearch }) => {
      if (quickSearch === undefined && oldQuickSearch === undefined) {
        return ''
      } else if (errorQuickSearch) {
        return <Box>No results</Box>
      } else {
        return (
          <UnorderedList
            listStyleType="none"
            padding="0px"
            width="100%"
            margin="0px"
            maxH={{ base: '72vh', md: '100%' }}
            overflowY="scroll"
            sx={{
              '&::-webkit-scrollbar': {
                width: '10px',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: `gray.300`,
                borderRadius: '8px',
              },
            }}
          >
            {(quickSearch || oldQuickSearch).map((result) => {
              if (result.type === 'crag') {
                return (
                  <QuickSearchResultItem
                    link={`/crags/${result.crag.id}`}
                    displayName={mostVoted(result.crag.name_votes)}
                    resultId={result.id}
                    resultType={result.type}
                    onClose={onClose}
                  />
                )
              }
              if (result.type === 'sector') {
                return (
                  <QuickSearchResultItem
                    link={`/crags/${result.sector.crag_id}/sectors/${result.sector.id}`}
                    displayName={
                      <>
                        <Wrap>
                          <Box lineHeight="15px">
                            {' '}
                            {mostVoted(result.sector.name_votes)}
                          </Box>

                          <CragBreadcrumb
                            fontSize="xs"
                            cragId={result.sector.crag_id}
                          ></CragBreadcrumb>
                        </Wrap>
                      </>
                    }
                    resultId={result.id}
                    resultType={result.type}
                    onClose={onClose}
                  ></QuickSearchResultItem>
                )
              }
              if (result.type === 'climb') {
                return (
                  <QuickSearchResultItem
                    link={`/crags/${result.climb.crag_id}/sectors/${result.climb.sector_id}/climbs/${result.climb.id}`}
                    displayName={
                      <>
                        <Wrap align="center">
                          <Box lineHeight="15px">
                            {mostVoted(result.climb.name_votes)}
                          </Box>
                          <Grade gradeId={result.climb.most_voted_grade} />
                          {result.climb.average_rating >= 1 ? (
                            <StarRatings
                              rating={result.climb.average_rating}
                              starRatedColor="gold"
                              numberOfStars={5}
                              name="rating"
                              starEmptyColor="none"
                              starDimension="15px"
                              starSpacing="1px"
                            />
                          ) : (
                            ''
                          )}{' '}
                          <SectorBreadcrumb
                            fontSize="xs"
                            sectorId={result.climb.sector_id}
                          />
                        </Wrap>
                      </>
                    }
                    resultId={result.id}
                    resultType={result.type}
                    onClose={onClose}
                  >
                    <Spacer />
                    <Box>
                      <Button
                        as={RouterLink}
                        to={`/crags/${result.climb.crag_id}/sectors/${result.climb.sector_id}/climbs/${result.climb.id}/add-ascent`}
                        size="sm"
                        colorScheme="brand"
                        color="white"
                      >
                        <TickRocksLogo
                          colorGreen="#fff"
                          colorWhite="#3CAB70"
                          h="12px"
                          w="20px"
                          mr="5px"
                        />
                        tick
                      </Button>
                    </Box>
                  </QuickSearchResultItem>
                )
              }
            })}
          </UnorderedList>
        )
      }
    }

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

          <InputGroup display={{ base: 'none', md: 'block' }}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              onClick={onOpen}
              border="none"
              alignSelf="flex-start"
              isReadOnly={true}
              placeholder="Search for crags, routes, climbers, etc."
              background="gray.600"
              color="brand.100"
              minW={{ sm: '10vw', md: '12vw', lg: '350px' }}
            />
          </InputGroup>
          <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay marginTop={{ base: '0px', md: '0px' }} />
            <ModalContent
              backgroundColor="brand.100"
              marginTop={{ base: '0px', sm: '10vh' }}
            >
              <ModalHeader>
                <Flex ml={5} mr={5} mt={5}>
                  <SearchIcon color="gray.300" w={5} h={5} mr={5} />
                  <Input
                    color="white"
                    variant="unstyled"
                    placeholder="Search for crags, routes, climbers, etc."
                    onChange={(event) => setSearchText(event.target.value)}
                    value={searchText || ''}
                  />
                </Flex>
                <ModalCloseButton
                  display={{ base: 'block', sm: 'none' }}
                  color="white"
                />
              </ModalHeader>
              <ModalBody>
                <QuickSearchResults quickSearch={quickSearch} />
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
                  <Heading
                    width="150px"
                    size="sm"
                    color="white"
                    fontFamily="sans-serif"
                    letterSpacing="1.5"
                  >
                    tick.rocks
                  </Heading>
                </HStack>

                <PhoneMenuItems textAlign="left" to="/search">
                  Scan
                </PhoneMenuItems>
                <PhoneMenuItems to="/map">Map</PhoneMenuItems>
                <PhoneMenuItems to="/crags">Crags</PhoneMenuItems>
                <PhoneMenuItems to="/add-crag">Add crag</PhoneMenuItems>

                <MenuDivider />
                {isAuthenticated ? (
                  <>
                    <PhoneMenuItems to={`/user/${user?.id}`}>
                      <HStack>
                        <Avatar name={user?.display_name} src="..." size="xs" />
                        <Text>{user?.display_name}</Text>
                      </HStack>
                    </PhoneMenuItems>
                    <PhoneMenuItems to="/ticklist">Ticklist</PhoneMenuItems>
                    <PhoneMenuItems to="/settings">Settings</PhoneMenuItems>
                    <Box
                      onClick={logout}
                      _hover={{
                        background: 'brand.300',
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
                      <Box pl="50px">Sign Out </Box>
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
                      background: '#3CAB70',
                      cursor: 'pointer',
                    }}
                    color="White"
                    width="100%"
                    height="100%"
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
      <Box h="55px" display={{ base: 'block', md: 'block' }} />

      <Box height="100%">
        <Flex
          width="100%"
          position={{ base: 'fixed', md: 'fixed' }}
          zIndex="overlay"
          as="nav"
          top="0px"
          pl={{ xxl: '14vw', xl: '80px', md: '5vw', base: '0px' }}
          pr={{ xxl: '14vw', xl: '80px', md: '5vw', base: '0px' }}
          align="center"
          justify="space-between"
          height="55px"
          bg="gray.700"
        >
          <HStack display={{ base: 'flex', md: 'none' }}>
            <MenuDrawer />

            <Button
              color={buttonColor}
              bgColor="gray.700"
              onClick={toggleColorMode}
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </HStack>
          <Spacer display={{ base: 'flex', md: 'none' }} />

          <Flex as={RouterLink} to="/" align="center">
            <TickRocksLogo />
            <Heading
              width="150px"
              size="sm"
              color="white"
              letterSpacing="1.5"
              display={{ base: 'none', xxs: 'block' }}
            >
              tick.rocks
            </Heading>
          </Flex>
          <Link
            mx="20px"
            href="https://github.com/opencrags/tick-rocks/issues"
            isExternal
          >
            <Tooltip label="tick.rocks is currently in open alpha, report bug?">
              <Tag colorScheme="red">ALPHA</Tag>
            </Tooltip>
          </Link>

          <Spacer display={{ base: 'flex', md: 'none' }} />
          <Box>
            <SearchModal />
          </Box>
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
              <MenuItems to="/search">Scan</MenuItems>
              <MenuItems to="/map">Map</MenuItems>
              <Box mx="5px">
                <ModalDialog
                  button={
                    <Button colorScheme="brand" color="white">
                      Add Crag
                    </Button>
                  }
                >
                  <AddCrag />
                </ModalDialog>
              </Box>

              <Button
                color={buttonColor}
                bgColor="gray.700"
                onClick={toggleColorMode}
              >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {isAuthenticated ? (
                <Menu>
                  <Avatar
                    as={MenuButton}
                    display={{ base: 'none', md: 'block' }}
                    margin="5"
                    name={user?.display_name}
                    src="..."
                    size="xs"
                  ></Avatar>
                  <MenuList>
                    <MenuItem as={RouterLink} to={`/user/${user?.id}`}>
                      {user?.display_name || 'No display name set'}
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
                <Box
                  variant="unstyled"
                  onClick={() =>
                    loginWithRedirect({
                      appState: { returnTo: window.location.pathname },
                    })
                  }
                  _hover={{
                    background: 'brand.300',
                    cursor: 'pointer',
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
                  <Center>Sign in</Center>
                </Box>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

const QuickSearchResultItem = ({
  onClose,
  link,
  displayName,
  resultType,
  key,
  children,
}) => {
  return (
    <Box onClick={onClose} as={RouterLink} to={link} key={key} w="100%">
      <ListItem
        padding={4}
        mb={1}
        borderRadius="5px"
        background="gray.600"
        _hover={{
          background: 'brand.300',
          cursor: 'pointer',
        }}
      >
        <Flex direction="row" align="center">
          <Flex direction="row" minW="70px">
            <Tag>{resultType}</Tag>
          </Flex>
          <Wrap color="white" fontFamily="sans-serif" fontWeight="bold">
            {displayName}
          </Wrap>
          {children}
        </Flex>
      </ListItem>
    </Box>
  )
}
