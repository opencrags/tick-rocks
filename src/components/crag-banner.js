import {
  Box,
  Image,
  Flex,
  VStack,
  Spacer,
  Center,
  Text,
  LinkBox,
  Heading,
  Button,
  Wrap,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { ParallaxBanner } from 'react-scroll-parallax'
import { useCrag, useCragPhoto, mostVoted, useSectors } from '../utils/backend'
import { CragComponentBox } from './crag-component-box'
import EditButton from './edit-button'
import VoteConflictWarning from './vote-conflict-warning'

import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Sector, SectorGrid, SectorList, SectorListItem } from './sectors'
import ModalDialog from './modal-dialog'
import DrawerDialog from './drawer-dialog'
function CragBannerMenuButton({ children, to, buttonicon, ...props }) {
  const bg = useColorModeValue('gray.200', 'white')
  return (
    <Box {...props}>
      <Box
        as={RouterLink}
        to={to}
        variant="unstyled"
        fontWeight="normal"
        fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
        letterSpacing="1.5pt"
        color={bg}
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

function CragBannerMenuDivider({ ...props }) {
  const bg = useColorModeValue('gray.200', 'white')
  return (
    <Box pt="13px" {...props}>
      <Box h="30px" bg={bg} w="1px" />
    </Box>
  )
}

function CragBannerMenu({ children }) {
  const bannerColor = useColorModeValue('gray.600', 'gray.800')
  const { cragId } = useParams()
  const { crag, error: cragError } = useCrag(cragId)
  const { sectors, error: errorSectors } = useSectors({ crag_id: cragId }, 100)
  console.log(crag)
  return (
    <Box
      position={{ base: 'relative', xxs: 'sticky' }}
      zIndex="3"
      top={{ base: '0px', xxs: '52px' }}
      bottom="0px"
      w="100%"
      bg={bannerColor}
      minHeight={{ base: '40px', sm: '50px' }}
      boxShadow="0px 12px 18px -20px rgba(0, 0, 0, 0.5)"
    >
      <Box>
        <Box
          pl={{
            md: '10vw',
            base: '20px',
          }}
          pr={{
            md: '10vw',
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
            <DrawerDialog
              placement="top"
              button={<CragBannerMenuButton>Sectors</CragBannerMenuButton>}
              header={
                <Wrap align="center">
                  <Heading>Sectors of {mostVoted(crag?.name_votes)}</Heading>{' '}
                  <Box left="10px">
                    <Button size="sm">Show in list</Button>
                  </Box>
                </Wrap>
              }
            >
              <CragBannerSectors />
            </DrawerDialog>
            <CragBannerMenuDivider />
            <CragBannerMenuButton to={`/crags/${cragId}/map`}>
              Map
            </CragBannerMenuButton>
            <CragBannerMenuDivider />
            <CragBannerMenuButton to={`/crags/${cragId}/discussion`}>
              Discuss
            </CragBannerMenuButton>
            <CragBannerMenuDivider />
            <CragBannerMenuButton to={`/crags/${cragId}#access`}>
              Access
            </CragBannerMenuButton>
            <CragBannerMenuDivider />
            <CragBannerMenuButton
              to={`/crags/${cragId}#photos`}
              display={{ base: 'none', xs: 'block' }}
            >
              Photos
            </CragBannerMenuButton>
            <Spacer />

            {children}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

function CragBanner({ children, cragId, ...props }) {
  const bannerColor = useColorModeValue('offwhite', 'gray.700')
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
              md: '11vw',
              base: '20px',
            }}
            pr={{
              md: '11vw',
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
        position="relative"
        minHeight={{ base: '40vh', md: '70vh', lg: '95vh' }}
        maxHeight={{ base: '200px', md: '70vh', lg: '95vh' }}
      >
        <Box
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
              amount: 0.4,
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
function CragBannerSectors({}) {
  const bannerColor = useColorModeValue('gray.600', 'gray.800')
  const { cragId } = useParams()
  const { crag, error: cragError } = useCrag(cragId)
  const { sectors, error: errorSectors } = useSectors({ crag_id: cragId }, 100)

  return (
    <Box>
      {sectors.length > 0 ? (
        <SectorList sectors={sectors}>
          {sectors
            .filter((sector) => sector.name_votes.length >= 1 && sector)
            .map((sector) => (
              <SectorListItem
                key={sector.id}
                cragId={crag.id}
                sectorId={sector.id}
              >
                <Text>{mostVoted(sector.name_votes)}</Text>
                <VoteConflictWarning
                  anyVotes={[sector.name_votes, sector.coordinate_votes]}
                />
              </SectorListItem>
            ))}
        </SectorList>
      ) : (
        <Center> No sectors has been added yet.</Center>
      )}
    </Box>
  )
}

export { CragBanner, CragBannerMenu, CragBannerMenuButton, CragFrontPageBanner }
