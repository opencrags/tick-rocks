import { Text } from '@chakra-ui/layout'
import { Box } from '@chakra-ui/layout'
import { SliderThumb } from '@chakra-ui/slider'
import { SliderFilledTrack } from '@chakra-ui/slider'
import { SliderTrack } from '@chakra-ui/slider'
import { Slider } from '@chakra-ui/slider'
import { useCallback, useEffect, useState } from 'react'
import useCallbackRef from '../hooks/use-callback-ref'

export default function RangeSlider({
  min,
  max,
  step = 1,
  fromArray,
  value,
  onChange,
  onChangeEnd,
  ...props
}) {
  const [lowerValue, setLowerValue] = useState(value[0])
  const [upperValue, setUpperValue] = useState(value[1])
  const onChangeCallback = useCallbackRef(onChange)
  const lowerChangeEnd = useCallbackRef((lowerValue) =>
    onChangeEnd([lowerValue, upperValue])
  )
  const upperChangeEnd = useCallbackRef((upperValue) =>
    onChangeEnd([lowerValue, upperValue])
  )

  const handleLowerChangeEnd = useCallback(
    () => lowerChangeEnd(lowerValue),
    [lowerChangeEnd, lowerValue]
  )
  const handleUpperChangeEnd = useCallback(
    () => upperChangeEnd(upperValue),
    [upperChangeEnd, upperValue]
  )

  useEffect(() => {
    onChangeCallback([lowerValue, upperValue])
  }, [lowerValue, upperValue, onChangeCallback])

  if ((fromArray && min) || (fromArray && max)) {
    throw new Error('fromArray should not be used with the min or max prop.')
  }

  const minimum = fromArray ? 0 : min
  const maximum = fromArray ? fromArray.length - 1 : max
  const displayFunction = fromArray
    ? (index) => fromArray[index]
    : (index) => index

  return (
    <Box position="relative" {...props} my={4}>
      <Box pos="absolute" top="0px" left="20px" w="calc(100% - 40px)">
        <Slider
          value={upperValue}
          min={minimum}
          max={maximum}
          step={step}
          onChange={(value) => setUpperValue(Math.max(lowerValue, value))}
          onChangeEnd={handleUpperChangeEnd}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={8}>
            <Text fontSize="xs">{displayFunction(upperValue)}</Text>
          </SliderThumb>
        </Slider>
      </Box>
      <Box w="calc(100% - 40px)" ml={5}>
        <Slider
          value={lowerValue}
          min={minimum}
          max={maximum}
          step={step}
          onChange={(value) => {
            // To make sure both sliders don't get stuck at 0
            // (only the lower value one is clickable)
            if (lowerValue === 0 && upperValue === 0) {
              setUpperValue(value)
            }
            setLowerValue(Math.min(value, upperValue))
          }}
          onChangeEnd={handleLowerChangeEnd}
        >
          <SliderTrack bg="transparent">
            <SliderFilledTrack bg="gray.200" zIndex={1} />
          </SliderTrack>

          <SliderThumb boxSize={8}>
            <Text fontSize="xs">{displayFunction(lowerValue)}</Text>
          </SliderThumb>
        </Slider>
      </Box>
    </Box>
  )
}
