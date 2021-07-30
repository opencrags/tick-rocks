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
  const MenuItems = props => {
  const { children, isLast, to = "/", ...rest } = props
    return (
      <Box as={RouterLink} to={to}
        _hover={{
          background: "brand.200",
          color: "White",}}
        width="100%"
        minWidth="100px"
        paddingBottom="5"
        paddingTop="5"
        paddingRight={{ base: 0, sm: isLast ? 1 : 1 }}
        paddingLeft={{ base: 0, sm: isLast ? 5 : 1 }}
        fontWeight="semibold">
        <Center>{children}</Center>
      </Box>
    )
  }

  function SearchModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(    
      <>
      <Box height={{base: "100%", md: "10"}}>
        <SearchIcon 
          display={{base: "block", md: "none" }} 
          color="brand.200" 
          h={8}
          w={8}
          paddingRight="10px"
          height="100%" 
          onClick={onOpen}/>
        <Input onClick={onOpen}
            alignSelf="flex-start"
            isReadOnly="true"
            placeholder="Search crags, routes, climbers, etc." 
            display={{ base: "none", md: "block", }}
            background= "white"
            color="gray.700"
            w="35vh"/>
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay marginTop={{ base: "65px", md: "0px"}}/>
          <ModalContent
            backgroundColor="brand.100"
            marginTop={{ base: "60px", md: "10vh"}}>
          <ModalBody >
          <Flex><SearchIcon display={{base: "none", md: "block" }} color="gray.300" w={5} h={5} margin="15px"/>
            <Input variant="unstyled"  placeholder="Search crags, routes, climbers, etc." />
          </Flex>
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
        <HamburgerIcon onClick={onOpen}
          h={10}
          w={10}
          paddingLeft="10px"
          height="100%"
          ref={btnRef} 
          display={{ base: "block", md: "none", lg:"none" }}
          color="brand.200"/> 
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent 
          background="brand.100">
            <DrawerBody padding="0px" >
              <Flex direction="column"
                margin="0px" 
                onClick={onClose} >
                <HStack>
                <Image src="/favicon-64.png"/>
                <Heading width="150px" size="sm" color="brand.200">
                  Tick Rocks
                </Heading>
                </HStack>
                  <MenuItems to="/map">Map</MenuItems>
                  <MenuItems to="/crags">Crags</MenuItems>
                  <MenuItems to="/add-crag" >Add crag</MenuItems>
                  <MenuDivider/>
                {isAuthenticated ? ( <>
                  <MenuItems to="/user-profile"><Avatar name="Rasmus Eriksson" src="..." size="xs"/><Text marginLeft="3">Rasmus Eriksson</Text></MenuItems>
                  <MenuItems to="/ticklist" >Ticklist</MenuItems>
                  <MenuItems to="/settings" >Settings</MenuItems>
                  <Box onClick={logout}
                    _hover={{
                      background: "brand.200",
                      color: "White",}}
                    width="100%"
                    minWidth="100px"
                    fontWeight="semibold"
                    pt="5"
                    pb="5">
                  <Center>Sign Out</Center></Box>
                  </>
                ) : (
                  <Box onClick={() => loginWithRedirect({appState: {returnTo: window.location.pathname,},})}
                    _hover={{
                      background: "brand.200",
                      color: "White",}}
                    width="100%"
                    minWidth="100px"
                    fontWeight="semibold"
                    pt="5"
                    pb="5">
                  <Center>Sign in</Center></Box>
                )}
                </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (

    <Flex 
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      width="100%"
      background={["brand.100", "brand.100", "brand.100", "brand.100"]}
      color={["Black", "Black", "primary.700", "primary.700"]}
      position={{ base: "fixed", sm: "relative" }}
      zIndex="docked"
      top={{ base: "0px", sm: "0px" }}
      h ="65px">
        <MenuDrawer/>
        <HStack as={RouterLink} to="/">
          <Image src="/favicon-64.png"/>
          <Heading width="150px" size="sm" color="brand.200" display={{ base: "none", md: "flex" }}>
            Tick Rocks
          </Heading>
        </HStack> 
      <SearchModal/>
      <Spacer display={{ base: "none", md: "block" }}/>
      <Box 
        display={{ base: show ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}>
        <Flex
          align={["center", "center", "center", "center"]}
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}>    
          <MenuItems to="/map" >Map</MenuItems>
          <MenuItems to="/crags">Crags</MenuItems>
          <MenuItems to="/add-crag" >Add crag</MenuItems>
          {isAuthenticated ? (
         
         <Menu>
          <Avatar as={MenuButton} display={{ base: "none", md: "block" }} margin="5" name="Rasmus Eriksson" src="..." size="xs">
          </Avatar>
          <MenuList>
              <MenuItem as={RouterLink} to="/user-profile">Rasmus Eriksson</MenuItem>
              <MenuItem as={RouterLink} to="/ticklist">Ticklist </MenuItem>
            <MenuDivider />
              <MenuItem as={RouterLink} to="/settings">Settings</MenuItem>
              <MenuItem onClick={logout} >Sign out</MenuItem>
          </MenuList>
          </Menu>
        
        )
          : (
            <MenuItems to="/" 
            ><Text onClick={() =>
              loginWithRedirect({appState: {returnTo: window.location.pathname,},})
            }>Sign in</Text></MenuItems>
          )}
        </Flex>
      </Box>
    </Flex>
  )
}
