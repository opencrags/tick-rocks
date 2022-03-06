import { Badge, Box } from '@chakra-ui/react'
import React from 'react'
import 'react-medium-image-zoom/dist/styles.css'

export default function DateBadge(date) {
  const newDate = addDays(date, 8).toLocaleString()
  const today = new Date().toLocaleString()

  if (date === undefined) {
    return ''
  }

  if (today > newDate)
    return (
      <Box pb="10px">
        <Badge colorScheme="green">New</Badge>
      </Box>
    )
}

function addDays(date, days) {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
