import {
  Box,
  Image,
  Flex,
  Menu,
  MenuList,
  VStack,
  Spacer,
  Center,
  Link,
  Wrap,
  SimpleGrid,
  Text,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Parallax, ParallaxBanner } from 'react-scroll-parallax'
import { useDisclosure } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/react'
function SectorDrawer({ children }) {
  const btnRef = React.useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const PhoneButton = (props) => {
    const { children } = props
    return (
      <Box>
        <Button
          ref={btnRef}
          onClick={onOpen}
          display={{ base: 'block', xl: 'none' }}
          zIndex="banner"
          position="fixed"
          borderRadius="40px"
          bottom="10px"
          right="15px"
          shadow="dark-lg"
          colorScheme="green"
        >
          {children}
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <CragBannerMenuButton ref={btnRef} onClick={onOpen}>
        Sectors
      </CragBannerMenuButton>
      <PhoneButton>Nearby</PhoneButton>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent background="brand.100" color="white">
          <DrawerHeader>
            <Flex padding="10px" direction="row" justify="space-between">
              <CloseIcon w="20px" h="15px" color="white" onClick={onClose} />
              <Heading color="white">Sectors</Heading>
            </Flex>
          </DrawerHeader>
          <DrawerBody padding="0px">
            <Flex direction="column">
              <Flex direction="row" justify="space-evenly"></Flex>
              <Box onClick={onClose}>{children}</Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

function CragBannerMenuButton({ children, to, buttonicon, ...props }) {
  return (
    <Box {...props}>
      <Box
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
          pr={{ base: '4px', sm: '8px', md: '10px' }}
          pl={{ base: '4px', sm: '8px', md: '10px' }}
          height="55px"
        >
          <Text>{children}</Text>
        </Center>
      </Box>
    </Box>
  )
}

function CragBannerMenuDivider(...props) {
  return (
    <Box pt="13px" {...props}>
      <Box h="30px" bg="gray.300" w="1px" />
    </Box>
  )
}

function CragBannerMenu({ children }) {
  return (
    <Box zIndex="1" position="sticky" top={{ base: '54px', md: '-1px' }}>
      <Box>
        <Flex bg="gray.200" mb="4px" mt="0px" justify="center">
          <CragBannerMenuButton>Home</CragBannerMenuButton>
          <CragBannerMenuDivider />
          <CragBannerMenuButton>Sectors</CragBannerMenuButton>

          <CragBannerMenuDivider />
          <CragBannerMenuButton>Map</CragBannerMenuButton>
          <CragBannerMenuDivider />
          <CragBannerMenuButton display={{ base: 'none', md: 'block' }}>
            Discussion
          </CragBannerMenuButton>
          <CragBannerMenuDivider display={{ base: 'none', md: 'block' }} />
          <CragBannerMenuButton>Access</CragBannerMenuButton>
          <CragBannerMenuDivider />
          <CragBannerMenuButton display={{ base: 'none', xs: 'block' }}>
            Photos
          </CragBannerMenuButton>
          <CragBannerMenuDivider display={{ base: 'none', xs: 'block' }} />
          <CragBannerMenuButton display={{ base: 'none', xxl: 'block' }}>
            Authors
          </CragBannerMenuButton>
          <CragBannerMenuDivider display={{ base: 'none', xxl: 'block' }} />

          {children}
        </Flex>
      </Box>
    </Box>
  )
}

function CragBanner({ children, cragBannerImage, ...props }) {
  return (
    <Box>
      <Box h={{ base: '150px', xs: '200px' }} w="100%" position="relative">
        <Image
          src={cragBannerImage}
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
          {...props}
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
            <Box>{children}</Box>
            <Box></Box>
            <VStack></VStack>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

function CragFrontPageBannerMenuButton({ children, to, buttonicon, ...props }) {
  return (
    <Box {...props}>
      <Box
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
          pr={{ base: '4px', sm: '8px', md: '10px' }}
          pl={{ base: '4px', sm: '8px', md: '10px' }}
          height="55px"
        >
          <Text>{children}</Text>
          <Box ml="5px" display={{ base: 'block', sm: 'none' }}>
            {buttonicon}
          </Box>
        </Center>
      </Box>
    </Box>
  )
}

function CragFrontPageBannerMenu({ children, ...props }) {
  return (
    <Flex
      position={{ base: 'relative', md: 'sticky' }}
      zIndex={{ base: 'initial', md: 'sticky' }}
      top="0px"
      bottom="0px"
      w="100%"
      justify-content="center"
      textColor="white"
      bg="gray.200"
      textColor="black"
      minHeight={{ base: '40px', sm: '50px' }}
      boxShadow="0px 12px 18px -20px rgba(0, 0, 0, 0.5)"
      {...props}
    >
      <Center w="inherit">
        <Flex ml={2} wrap="wrap" w="inherit">
          <Spacer display={{ base: 'none', sm: 'block' }} />
          <CragFrontPageBannerMenuButton
            display={{ base: 'none', xs: 'block' }}
          >
            Home
          </CragFrontPageBannerMenuButton>
          <CragBannerMenuDivider />
          <CragFrontPageBannerMenuButton>Sectors</CragFrontPageBannerMenuButton>
          <CragBannerMenuDivider />
          <CragFrontPageBannerMenuButton>Map</CragFrontPageBannerMenuButton>
          <CragBannerMenuDivider />
          <CragFrontPageBannerMenuButton>
            Discussion
          </CragFrontPageBannerMenuButton>
          <CragBannerMenuDivider />
          <CragFrontPageBannerMenuButton to="#cragPhotos">
            Photos
          </CragFrontPageBannerMenuButton>
          <CragBannerMenuDivider />
          <CragFrontPageBannerMenuButton>Access</CragFrontPageBannerMenuButton>
          <CragBannerMenuDivider />
          <CragFrontPageBannerMenuButton
            display={{ base: 'none', sm: 'block' }}
          >
            Authors
          </CragFrontPageBannerMenuButton>
          <CragBannerMenuDivider />
          {children}
          <Spacer display={{ base: 'none', sm: 'block' }} />
        </Flex>
      </Center>
    </Flex>
  )
}

function CragFrontPageBanner({
  bgParallaxAmount,
  cragParallaxAmount,
  children,
  cragBannerImage,
  ...props
}) {
  return (
    <Box>
      <Box
        minHeight={{ base: '40vh', md: '70vh', lg: '95vh' }}
        maxHeight={{ base: '200px', md: '70vh', lg: '95vh' }}
        {...props}
      >
        <ParallaxBanner
          layers={[
            {
              image:
                'https://27crags.s3.amazonaws.com/photos/000/213/213830/size_xl-9d8dc766475a.jpg',
              amount: 0.5,
            },

            {
              amount: 0,
              children: (
                <Box
                  position="absolute"
                  height="100%"
                  width="100%"
                  bg="blackAlpha.300"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                ></Box>
              ),
            },
            {
              amount: 0.6,
              children: (
                <Flex
                  position="sticky"
                  textColor="white"
                  top={{ base: '8vh', md: '20vh', lg: '35vh' }}
                  pl={{ xxl: '250px', xl: '150px', lg: '80px', base: '40px' }}
                  w="100%"
                >
                  <Box>{children}</Box>
                </Flex>
              ),
            },
          ]}
          style={{
            minHeight: 'inherit',
            maxHeight: 'inherit',
          }}
        ></ParallaxBanner>
      </Box>
    </Box>
  )
}

export {
  CragBanner,
  CragBannerMenu,
  CragBannerMenuButton,
  CragFrontPageBanner,
  CragFrontPageBannerMenu,
  CragFrontPageBannerMenuButton,
}
