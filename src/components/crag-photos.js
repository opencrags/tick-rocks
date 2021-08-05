import {
  Box,
  Image,
  SimpleGrid,
  useDisclosure,
  SlideFade,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Parallax, ParallaxBanner } from 'react-scroll-parallax'

function CragPhotoGrid({ children, ...props }) {
  return (
    <Box>
      {children}
      <SimpleGrid
        columns={[1, 2, 2, 2, 3]}
        gridAutoFlow="row dense"
        spacing="5px"
        margin="5px"
      >
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/075/75038/size_xl-51f3b20cc4af.png" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/086/86608/size_xl-b84cf248cff7.jpg" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/064/64474/size_xl-c06bad023ce7.jpg" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/081/81392/size_xl-003920a9beef.jpg" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/056/56906/size_xl-64df3ee6b279.jpg" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/062/62491/size_xl-8e3054119a11.jpg" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/213/213913/size_xl-d16b8a6b9f2b.jpg" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/056/56873/size_xl-c67d6243d0c8.jpg" />
        <CragPhotos img="https://27crags.s3.amazonaws.com/photos/000/052/52533/size_xl-109573834ada.jpg" />
      </SimpleGrid>
    </Box>
  )
}

function CragPhotos({ img, ...props }) {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Box onPointerEnter={onToggle} onPointerLeave={onToggle}>
      <Box
        FlexGrow="1"
        h={{ base: '40vh', md: '60vh' }}
        width="100%"
        objectFit="cover"
        verticalAlign="bottom"
        bgImage={img}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        position="relative"
      >
        <SlideFade in={isOpen} offsetY="-20px">
          <Box
            p="40px"
            color="white"
            mt="4"
            bg="gray.500"
            roundedRight="md"
            shadow="md"
            position="absolute"
            left="0px"
          >
            Uploaded by Rasmus Eriksson
          </Box>
        </SlideFade>
      </Box>
    </Box>
  )
}

export { CragPhotoGrid }
