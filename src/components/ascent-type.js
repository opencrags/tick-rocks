import { Tag, TagLeftIcon, TagLabel, Icon, Tooltip } from '@chakra-ui/react'

import React from 'react'

export default function AscentType({ ascent }) {
  const RedPoint = (props) => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  )
  const OnSight = (props) => (
    <Icon viewBox="0 0 55 40" {...props}>
      <path
        fill="currentColor"
        d="M29.07.07h-.52S10.74-2.05 0 17.01c10.74 19.02 28.55 16.95 28.55 16.95h.52s17.81 2.07 28.55-16.95C46.88-2.05 29.07.07 29.07.07zm0 7.88c3.07 0 5.56 2.52 5.56 5.62 0 3.11-2.49 5.62-5.56 5.62s-5.56-2.52-5.56-5.62S26 7.95 29.07 7.95zm.1 20.35h-.34S17.4 29.64 10.51 17.63c1.91-3.34 4.17-5.63 6.45-7.23-.31 1.1-.48 2.24-.48 3.44 0 7.03 5.64 12.73 12.59 12.73 6.96 0 12.59-5.7 12.59-12.73 0-1.15-.16-2.26-.44-3.31 2.21 1.58 4.41 3.85 6.28 7.1C40.6 29.64 29.17 28.3 29.17 28.3z"
      />
    </Icon>
  )

  const Flash = (props) => (
    <Icon viewBox="-50 0 300 100" {...props}>
      <path
        fill="currentColor"
        d="M0 186.31 54.38 38.831 4.602 37.24l67.434-143.95 67.424.132-33.097 87.63 52.235-.454L0 186.309z"
      />
    </Icon>
  )

  if (ascent.ascent_type === 'redpoint') {
    return (
      <Tooltip
        closeDelay={500}
        hasArrow
        label={ascent.attempts}
        bg="gray.300"
        color="black"
      >
        <Tag size="sm" variant="subtle" colorScheme="red">
          <TagLeftIcon boxSize="15px" as={RedPoint} color="red" />
          <TagLabel size="sm">Rotpunkt</TagLabel>
        </Tag>
      </Tooltip>
    )
  }

  if (ascent.ascent_type === 'onsight') {
    return (
      <Tooltip
        closeDelay={500}
        hasArrow
        label="First try!"
        bg="gray.300"
        color="black"
      >
        <Tag size="sm" variant="subtle" colorScheme="orange">
          <TagLeftIcon boxSize="15px" as={OnSight} />
          <TagLabel>On-sight</TagLabel>
        </Tag>
      </Tooltip>
    )
  }
  if (ascent.ascent_type === 'flash') {
    return (
      <Tooltip
        closeDelay={500}
        hasArrow
        label="First try!"
        bg="gray.300"
        color="black"
      >
        <Tag size="sm" variant="subtle" colorScheme="yellow">
          <TagLeftIcon boxSize="15px" as={Flash} />
          <TagLabel>Flash!</TagLabel>
        </Tag>
      </Tooltip>
    )
  }
  return ''
}
