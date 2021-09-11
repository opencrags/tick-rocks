import {
  Box,
  Grid,
  Heading,
  Center,
  Flex,
  Button,
  Spacer,
  Container,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Grade from '../components/grade'
import { useClimbs, useCrag } from '../utils/backend'
const climbId = ''
function CragGrades({ selection, children, ...props }) {
  const { cragId } = useParams()
  const { climbs, error: errorClimbs } = useClimbs({ crag_id: cragId })
  if (errorClimbs) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load climbs.</Text>
        </Center>
      </Container>
    )
  }

  if (climbs === undefined) {
    return <Center>Climbs undefined.</Center>
  }

  if (climbs.length < 1) {
    return <Center>This crag does not yet have any climbs.</Center>
  }

  const reducer = (climbs, most_voted_grade) => {
    if (climbs[most_voted_grade] == null) {
      climbs[most_voted_grade] = 1
    } else {
      ++climbs[most_voted_grade]
    }
    return climbs
  }

  const reducedGrades = climbs
    .sort((a, b) => (a.itemM > b.itemM ? 1 : -1))
    .map((reducedGrades) => reducedGrades.most_voted_grade)
    .reduce(reducer, {})

  const numberOfClimbs = Object.keys(climbs).length + 1

  const gradeColorScheme = [
    ['1', 'Green'],
    ['2', 'Green'],
    ['3', 'Green'],
    ['4', 'Green'],
    ['4+', 'Green'],
    ['5', 'Green'],
    ['5+', 'Green'],
    ['6A', 'Green'],
    ['6A+', 'Green'],
    ['6B', 'Green'],
    ['6B+', 'Green'],
    ['6C', 'Green'],
    ['6C+', 'Green'],
    ['7A', 'Green'],
    ['7A+', 'Green'],
    ['7B', 'Green'],
    ['7B+', 'Green'],
    ['7C', 'Green'],
    ['7C+', 'Green'],
    ['8A', 'Green'],
    ['8A+', 'Green'],
    ['8B', 'Green'],
    ['8B+', 'Green'],
    ['8C', 'Green'],
    ['8C+', 'Green'],
    ['9A', 'Green'],
  ]

  return (
    <Box id="cragGrades" mt="5px" mb="5px">
      <Box mx={{ base: '10px', xl: '10vw' }}>
        <Flex align="flex-end" justify="center" height="20vh" direction="row">
          {Object.entries(reducedGrades).map((grade) => {
            const height = (grade[1] / numberOfClimbs) * 15
            return (
              <Flex
                minWidth="40px"
                width="20vw"
                direction="column"
                as={RouterLink}
                to={`list/filter=?${grade[0]}`}
              >
                <Box>
                  <Box
                    borderColor="brand.100"
                    fontSize="sm"
                    boxShadow="2px 2px 4px -2px rgba(0,0,0,0.56)"
                    key={grade[0]}
                    maxHeight="100%"
                    height={`${height}vh`}
                    bgColor="gray.800"
                    color="white"
                    _hover={{ mb: '5px' }}
                    transition="all .2s"
                  >
                    <Center>{grade[1]}</Center>
                  </Box>
                  <Center>
                    <Grade gradeId={grade[0]} />
                  </Center>
                </Box>
              </Flex>
            )
          })}
        </Flex>
      </Box>
    </Box>
  )
}

function SectorGrades({ sectorId, selection, children, ...props }) {
  const { climbs, error: errorClimbs } = useClimbs({ sector_id: sectorId })
  if (errorClimbs) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load climbs.</Text>
        </Center>
      </Container>
    )
  }

  if (climbs === undefined) {
    return <Center>Climbs undefined.</Center>
  }

  if (climbs.length < 1) {
    return (
      <Center padding="5px" bg="blackAlpha.600">
        This crag does not yet have any climbs.
      </Center>
    )
  }

  const reducer = (climbs, most_voted_grade) => {
    if (climbs[most_voted_grade] == null) {
      climbs[most_voted_grade] = 1
    } else {
      ++climbs[most_voted_grade]
    }
    return climbs
  }

  const reducedGrades = climbs
    .sort((a, b) => (a.itemM > b.itemM ? 1 : -1))
    .map((reducedGrades) => reducedGrades.most_voted_grade)
    .reduce(reducer, {})

  const numberOfClimbs = Object.keys(climbs).length + 1

  const gradeColorScheme = [
    ['1', 'Green'],
    ['2', 'Green'],
    ['3', 'Green'],
    ['4', 'Green'],
    ['4+', 'Green'],
    ['5', 'Green'],
    ['5+', 'Green'],
    ['6A', 'Green'],
    ['6A+', 'Green'],
    ['6B', 'Green'],
    ['6B+', 'Green'],
    ['6C', 'Green'],
    ['6C+', 'Green'],
    ['7A', 'Green'],
    ['7A+', 'Green'],
    ['7B', 'Green'],
    ['7B+', 'Green'],
    ['7C', 'Green'],
    ['7C+', 'Green'],
    ['8A', 'Green'],
    ['8A+', 'Green'],
    ['8B', 'Green'],
    ['8B+', 'Green'],
    ['8C', 'Green'],
    ['8C+', 'Green'],
    ['9A', 'Green'],
  ]

  return (
    <Box id="cragGrades" mt="5px" mb="5px">
      <Box>
        <Flex align="flex-end" justify="center" height="200px" direction="row">
          {Object.entries(reducedGrades).map((grade) => {
            const height = (grade[1] / numberOfClimbs) * 10
            return (
              <Flex flexGrow="1" direction="column">
                <Box>
                  <Box
                    borderColor="brand.100"
                    fontSize="sm"
                    boxShadow="2px 2px 4px -2px rgba(0,0,0,0.56)"
                    key={grade[0]}
                    maxHeight="100%"
                    height={`${height}vh`}
                    bgColor="gray.800"
                    color="white"
                    _hover={{ mb: '5px' }}
                    transition="all .2s"
                  >
                    <Center>{grade[1]}</Center>
                  </Box>
                  <Center>
                    <Grade gradeId={grade[0]} />
                  </Center>
                </Box>
              </Flex>
            )
          })}
        </Flex>
      </Box>
    </Box>
  )
}

export { CragGrades, SectorGrades }
