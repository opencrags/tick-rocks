import {
  Box,
  Grid,
  Heading,
  Center,
  Flex,
  Button,
  Spacer,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

function CragGrades({ children, ...props }) {
  return (
    <Box id="cragGrades" mt="5px" mb="5px">
      <Flex position="sticky" top="65px" mt="10px" mb="5px" zIndex="2">
        <Heading
          color="white"
          size="2xl"
          fontFamily="sans-serif"
          fontWeight="bold"
          letterSpacing="tighter"
          padding="10px"
          textShadow="3px 3px 3px rgba(0, 0, 0, 0.2)"
        >
          Gradespan
        </Heading>
        <Spacer />
        <Button boxShadow="xl" pr={8} pl={8} m={2} colorScheme="gray">
          View list
        </Button>
      </Flex>

      <Box
        ml={{ base: '3vW', md: '15vw' }}
        mr={{ base: '3vW', md: '15vw' }}
        pb="10px"
      >
        <Grid
          alignItems="end"
          templateColumns="repeat(14, 1fr)"
          gap="0"
          height="30vh"
        >
          <GradeLine
            to="/routes?filter=3"
            w="100%"
            h="30%"
            barColor="green.400"
            textColor="white"
          >
            3
          </GradeLine>
          <GradeLine
            to="/routes?filter=4"
            w="100%"
            h="40%"
            barColor="green.500"
            textColor="white"
          >
            4
          </GradeLine>
          <GradeLine
            to="/routes?filter=5"
            w="100%"
            h="55%"
            barColor="blue.200"
            textColor="white"
          >
            5
          </GradeLine>
          <GradeLine
            to="/routes?filter=5+"
            w="100%"
            h="60%"
            barColor="blue.300"
            textColor="white"
          >
            6
          </GradeLine>
          <GradeLine
            to="/routes?filter=6B"
            w="100%"
            h="52%"
            barColor="red.300"
            textColor="white"
          >
            5
          </GradeLine>
          <GradeLine
            to="/routes?filter=6C"
            w="100%"
            h="80%"
            barColor="red.400"
            textColor="white"
          >
            8
          </GradeLine>
          <GradeLine
            to="/routes?filter=7A"
            w="100%"
            h="89%"
            barColor="red.500"
            textColor="white"
          >
            9
          </GradeLine>
          <GradeLine
            to="/routes?filter=7B"
            w="100%"
            h="77%"
            barColor="gray.600"
            textColor="white"
          >
            8
          </GradeLine>
          <GradeLine
            to="/routes?filter=7C"
            w="100%"
            h="72%"
            barColor="gray.800"
            textColor="white"
          >
            7
          </GradeLine>
          <GradeLine
            to="/routes?filter=8A"
            w="100%"
            h="75%"
            barColor="gray.900"
            textColor="white"
          >
            7
          </GradeLine>
          <GradeLine
            to="/routes?filter=8B"
            w="100%"
            h="62%"
            barColor="gray.300"
            textColor="black"
          >
            6
          </GradeLine>
          <GradeLine
            to="/routes?filter=8C"
            w="100%"
            h="50%"
            barColor="gray.200"
            textColor="black"
          >
            5
          </GradeLine>
          <GradeLine
            to="/routes?filter=9A"
            w="100%"
            h="15%"
            barColor="gray.100"
            textColor="black"
          >
            2
          </GradeLine>
          <GradeLine
            to="/routes?filter=9A"
            w="100%"
            h="10%"
            barColor="pink.300"
            textColor="black"
          >
            1
          </GradeLine>
        </Grid>
        <Grid
          align="center"
          fontSize="xs"
          textColor="white"
          alignItems="start"
          templateColumns="repeat(14, 2fr)"
          templateRows="2"
          gap="1"
        >
          <Box>3</Box>
          <Box>4</Box>
          <Box>5</Box>
          <Box>5+</Box>
          <Box>6A</Box>
          <Box>6B</Box>
          <Box>6C</Box>
          <Box>7A</Box>
          <Box>7B</Box>
          <Box>7C</Box>
          <Box>8A</Box>
          <Box>8B</Box>
          <Box>8C</Box>
          <Box>9A</Box>
        </Grid>
      </Box>
    </Box>
  )
}

function GradeLine({ to, children, barColor, textColor, ...props }) {
  return (
    <Box
      as={RouterLink}
      to={to}
      w="100%"
      _hover={{ mb: '15px' }}
      transition="all .2s"
      borderColor="brand.100"
      bg={barColor}
      color={textColor}
      fontSize="sm"
      boxShadow="2px 2px 4px -2px rgba(0,0,0,0.56)"
      {...props}
    >
      <Center position="sticky" top="100px">
        {children}
      </Center>
    </Box>
  )
}

export { CragGrades }
