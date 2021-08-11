import { Box, Heading } from '@chakra-ui/react'
import SearchResult from './search-result'

export default function SearchResults({ climbs }) {
  if (!climbs || !climbs.length) return null

  return (
    <>
      <Heading as="h2">Results</Heading>
      <Box ml={4}>
        {climbs.map((climb) => (
          <SearchResult key={climb.climb_id} climb={climb} />
        ))}
      </Box>
    </>
  )
}
