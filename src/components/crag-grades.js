import {
  Box,
  Grid,
  Heading,
  Center,
  Flex,
  Button,
  Spacer,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Grade from '../components/grade'
const gradeId = ''
function CragGrades({ children, ...props }) {
  const gradeArray = [
    {
      grade: 'bfeb8d57-d12b-4876-b77a-b9cd592bbd70',
      number_of_problems: 19,
      color: 'blue.400',
      textColor: 'black',
    },
    {
      grade: 'cafc5e62-dac4-4426-9acf-bad6fee56f6e',
      number_of_problems: 22,
      color: 'gray.600',
      textColor: 'white',
    },
    {
      grade: 'd2de5736-9426-4507-ad2e-851b8d9cdbda',
      number_of_problems: 19,
      color: 'gray.900',
      textColor: 'white',
    },
    {
      grade: '95e95161-abd2-4cae-b956-a77df2eb96ec',
      number_of_problems: 12,
      color: 'gray.800',
      textColor: 'white',
    },
  ]

  return (
    <Box id="cragGrades" mt="5px" mb="5px">
      <Box ml={{ base: '3vW', md: '15vw' }} mr={{ base: '3vW', md: '15vw' }}>
        <Flex align="flex-end" justify="center" height="200px" direction="row">
          {gradeArray.map((grades) => (
            <Flex
              minWidth="40px"
              width="20vw"
              direction="column"
              as={RouterLink}
              to={`list/filter=${grades.grade}`}
              key={grades.grade}
            >
              <Box>
                <Box
                  borderColor="brand.100"
                  fontSize="sm"
                  boxShadow="2px 2px 4px -2px rgba(0,0,0,0.56)"
                  key={grades}
                  height={`1${grades.number_of_problems}px`}
                  bgColor={grades.color}
                  color={grades.textColor}
                  _hover={{ mb: '5px' }}
                  transition="all .2s"
                >
                  <Center>{grades.number_of_problems}</Center>
                </Box>
                <Center color="white">
                  <Grade gradeId={grades.grade} />
                </Center>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

export { CragGrades }
