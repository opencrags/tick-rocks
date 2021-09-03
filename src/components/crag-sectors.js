import {
  Box,
  SimpleGrid,
  Center,
  Flex,
  useDisclosure,
  SlideFade,
  LinkBox,
  Fade,
  Collapse,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useImages } from '../utils/backend.js'
import { CragGrades, SectorGrades } from './crag-grades.js'
function CragSectorGrid({ sectors, children, ...props }) {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  const responsiveColumns = useBreakpointValue({
    base: 3,
    xxs: 3,
    xs: 3,
    sm: 4,
    md: 5,
    lg: 5,
    xl: 5,
    xxl: 5,
    xxxl: 5,
  })
  console.log(responsiveColumns)
  console.log(sectors.length)
  return (
    <Box>
      <Collapse startingHeight="30vh" in={show}>
        <SimpleGrid
          display="grid"
          overflowX="auto"
          columns={[3, 3, 4, 5]}
          gridAutoFlow="row dense"
          spacing="5px"
          marginLeft="10px"
          marginRight="10px"
          position="relative"
        >
          {children}
        </SimpleGrid>
      </Collapse>
      <Center>
        {sectors.length > responsiveColumns ? (
          <Button
            w="100%"
            mx="10px"
            onClick={handleToggle}
            mt="5px"
            colorScheme="gray"
            boxShadow="md"
          >
            View {show ? 'less' : 'more'}
          </Button>
        ) : (
          ''
        )}
      </Center>
    </Box>
  )
}

function CragSector({ cragId, sectorId, children, ...props }) {
  const { images, error: errorImages } = useImages({ sector_id: sectorId })
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Box
      onPointerEnter={onToggle}
      onPointerLeave={onToggle}
      bgColor="gray.500"
      borderRadius="5px"
    >
      <LinkBox
        as={RouterLink}
        to={`/crags/${cragId}/sectors/${sectorId}`}
        flexGrow="1"
        height="100%"
        width="100%"
        position="relative"
      >
        <Box
          flexGrow="1"
          h={{ base: '30vh', lg: '30vh' }}
          objectFit="cover"
          verticalAlign="bottom"
          bgImage={
            images !== undefined && images.length > 0
              ? images[0].base64_image
              : '/icon-no-image.svg'
          }
          bgPosition="center"
          borderRadius="5px"
          bgRepeat="no-repeat"
          bgSize="cover"
          position="relative"
          transition="all .2s"
        >
          <Fade in={isOpen}>
            <Box
              borderRadius="5px"
              color="white"
              position="absolute"
              left="0px"
              bottom="0px"
              w="100%"
            >
              <SectorGrades sectorId={sectorId} />
            </Box>
          </Fade>
          <Flex
            textOverflow="ellipsis"
            whiteSpace="normal"
            flexWrap="wrap"
            justify="center"
            bg="blackAlpha.500"
            borderTopRadius="5px"
            maxW="100%"
            color="white"
            fontWeight="normal"
            fontSize="md"
            letterSpacing="0.5pt"
          >
            {children}
          </Flex>
        </Box>
      </LinkBox>
    </Box>
  )
}

export { CragSectorGrid, CragSector }
