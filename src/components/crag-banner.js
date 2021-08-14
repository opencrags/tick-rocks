import {
  Box,
  Image,
  Flex,
  VStack,
  Spacer,
  Center,
  Text,
  LinkBox,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { ParallaxBanner } from 'react-scroll-parallax'
import { useCrag, useCragPhoto, mostVoted } from '../utils/backend'
import EditButton from './edit-button'
import VoteConflictWarning from './vote-conflict-warning'

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

function CragBanner({ children, cragId, ...props }) {
  const { crag, error: cragError } = useCrag(cragId)
  const { cragPhoto, error: cragPhotoError } = useCragPhoto(
    crag && crag.banner_votes.length >= 1 ? mostVoted(crag.banner_votes) : null
  )

  if (
    crag === undefined ||
    (cragPhoto === undefined && crag.banner_votes.length >= 1)
  ) {
    return 'Loading...'
  }

  if (cragError || cragPhotoError) {
    return 'Error loading crag photo'
  }

  return (
    <Box>
      <Box h={{ base: '150px', xs: '200px' }} w="100%" position="relative">
        <Image
          src={cragPhoto?.base64_image}
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
  cragId,
  ...props
}) {
  const { crag, error: cragError } = useCrag(cragId)
  const { cragPhoto, error: cragPhotoError } = useCragPhoto(
    crag && crag.banner_votes.length >= 1 ? mostVoted(crag.banner_votes) : null
  )

  if (
    crag === undefined ||
    (cragPhoto === undefined && crag.banner_votes.length >= 1)
  ) {
    return 'Loading...'
  }

  if (cragError || cragPhotoError) {
    return 'Error loading crag photo'
  }

  return (
    <Box>
      <Box
        minHeight={{ base: '40vh', md: '70vh', lg: '95vh' }}
        maxHeight={{ base: '200px', md: '70vh', lg: '95vh' }}
        {...props}
      >
        <Box
          color="white"
          height="0px"
          position="sticky"
          zIndex="1"
          top="60px"
          width="100%"
          textAlign="right"
        >
          <LinkBox as={RouterLink} to={`/crags/${cragId}/vote-banner`}>
            <EditButton size="lg" />
            <VoteConflictWarning votes={crag.banner_votes} />
          </LinkBox>
        </Box>
        <ParallaxBanner
          layers={[
            {
              image: cragPhoto?.base64_image,
              amount: 0.5,
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
