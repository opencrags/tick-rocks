import { Box, HStack } from '@chakra-ui/react'

export function TickRocksLogo({ colorGreen, colorWhite, h, w, mr }) {
  var colorGreen = colorGreen || '#3CAB70'
  var colorWhite = colorWhite || '#fff'
  var h = h || '30px'
  var w = w || '45px'
  var mr = mr || '10px'
  return (
    <Box h={h} w={w} mr={mr}>
      <svg
        data-name="Lager 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 194.5 130.5"
      >
        <path
          d="M131 0L93 5a25 25 0 00-5 1L52 18a25 25 0 00-12 9L5 72a25 25 0 001 32l13 16a25 25 0 0019 9l106 1a25 25 0 0010-1l21-9a25 25 0 0015-20l4-40a25 25 0 00-8-21L151 7a25 25 0 00-20-7z"
          fill={colorGreen}
          data-name="Lager 2"
        />
        <path
          d="M67 116a6 6 0 01-6 4h0-18a20 20 0 01-15-7l-10-12a21 21 0 010-26l27-35c1-2 5-6 7-6 3 0 4 5 3 7l-1 6-4 20a8 8 0 002 7l17 17a6 6 0 012 5z"
          stroke={colorGreen}
          strokeWidth="4"
          fill={colorWhite}
          strokeMiterlimit="10"
          data-name="Lager 3"
        />
        <path
          d="M164 43l-7-6a3 3 0 00-4-1l-50 50a3 3 0 01-4 0L74 61a3 3 0 00-4 0l-7 7a3 3 0 000 5l36 35a3 3 0 004 1l61-61a3 3 0 000-5z"
          fill={colorWhite}
          data-name="Lager 5"
        />
      </svg>
    </Box>
  )
}
