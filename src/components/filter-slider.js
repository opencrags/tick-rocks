import {
  Box,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'

export default function FilterSlider({ label, ...props }) {
  return (
    <HStack justify="space-between" mr={2}>
      <Heading ml={4} size="md">
        {label}
      </Heading>
      <Box w="calc(100% - 40px)">
        <Slider {...props}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={8}>
            <Text fontSize="xs">{props.value}</Text>
          </SliderThumb>
        </Slider>
      </Box>
    </HStack>
  )
}
