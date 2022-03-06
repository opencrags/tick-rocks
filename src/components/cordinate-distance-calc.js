import { Text } from '@chakra-ui/react'
import React from 'react'

export function CalcDistance({ lat1, lon1, lat2, lon2 }) {
  var R = 6371 // km
  var dLat = toRad(lat2 - lat1)
  var dLon = toRad(lon2 - lon1)
  const newLat1 = toRad(lat1)
  const newLat2 = toRad(lat2)

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(newLat1) *
      Math.cos(newLat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c * 1000
  var e = d.toString()
  var f = e.substr(0, 3)
  return <Text>{f}m</Text>
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180
}
