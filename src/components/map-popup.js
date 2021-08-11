import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Flex, Text, VStack } from '@chakra-ui/layout'
import { useState } from 'react'
import { IconButton } from '@chakra-ui/button'
import SearchResult from './search-result'

export default function MapPopup({ climbs }) {
  const [climbIndex, setClimbIndex] = useState(0)

  if (!climbs) return null

  const climb = climbs[climbIndex]
  const nClimbs = climbs.length

  let leftArrow = null
  let rightArrow = null
  let nMoreClimbs = null

  if (nClimbs > 1) {
    leftArrow = (
      <IconButton
        aria-label="previous-climb"
        icon={<ChevronLeftIcon />}
        flex="0 0 0"
        size="xs"
        variant="ghost"
        onClick={() =>
          setClimbIndex((oldIndex) => (oldIndex - 1 + nClimbs) % nClimbs)
        }
      />
    )
    rightArrow = (
      <IconButton
        aria-label="next-climb"
        icon={<ChevronRightIcon />}
        flex="0 0 0"
        size="xs"
        onClick={() => setClimbIndex((oldIndex) => (oldIndex + 1) % nClimbs)}
        variant="ghost"
      />
    )
    nMoreClimbs = (
      <Text size="xs">{`${nClimbs - 1} more climb${
        nClimbs > 2 ? 's' : ''
      }...`}</Text>
    )
  }

  return (
    <VStack align="center">
      <Flex align="center" direction="row" mt={2} width="100%">
        {leftArrow}
        <SearchResult climb={climb} />
        {rightArrow}
      </Flex>
      {nMoreClimbs}
    </VStack>
  )
}
