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
  MenuButton,
  MenuItem,
  Stack,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Parallax, ParallaxBanner } from 'react-scroll-parallax'

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
          height="40px"
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

function CragBannerMenu({ children }) {
  return (
    <Box
      bg="gray.200"
      mb="4px"
      pl={{ xxl: '700px', xl: '350px', lg: '100px', md: '50px', base: '20px' }}
      pr={{ xxl: '700px', xl: '350px', lg: '100px', md: '50px', base: '20px' }}
    >
      <Box w="100%">
        <Wrap>
          <CragBannerMenuButton display={{ base: 'none', sm: 'block' }}>
            Home
          </CragBannerMenuButton>
          <CragBannerMenuButton>Topo</CragBannerMenuButton>
          <CragBannerMenuButton>Map</CragBannerMenuButton>
          <CragBannerMenuButton>Discussion</CragBannerMenuButton>
          <CragBannerMenuButton>Access</CragBannerMenuButton>
          <CragBannerMenuButton>Photos</CragBannerMenuButton>
          <CragBannerMenuButton display={{ base: 'none', sm: 'block' }}>
            Authors
          </CragBannerMenuButton>
          <Spacer display={{ base: 'none', sm: 'block' }} />

          {children}
        </Wrap>
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
              xxl: '700px',
              xl: '350px',
              lg: '100px',
              md: '50px',
              base: '20px',
            }}
            pr={{
              xxl: '700px',
              xl: '350px',
              lg: '100px',
              md: '50px',
              base: '20px',
            }}
            position="relative"
            w="100%"
            justify="space-between"
          >
            <Box>{children}</Box>
            <Box></Box>
            <VStack>
              <Link>Länkar</Link>
              <Link>....</Link>
              <Link>....</Link>
            </VStack>
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
          height="40px"
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
          <CragFrontPageBannerMenuButton>Topo</CragFrontPageBannerMenuButton>
          <CragFrontPageBannerMenuButton>Map</CragFrontPageBannerMenuButton>
          <CragFrontPageBannerMenuButton>
            Discussion
          </CragFrontPageBannerMenuButton>
          <CragFrontPageBannerMenuButton to="#cragPhotos">
            Photos
          </CragFrontPageBannerMenuButton>
          <CragFrontPageBannerMenuButton>Access</CragFrontPageBannerMenuButton>
          <CragFrontPageBannerMenuButton
            display={{ base: 'none', sm: 'block' }}
          >
            Authors
          </CragFrontPageBannerMenuButton>

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
