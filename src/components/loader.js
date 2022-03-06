import { CircularProgress, Container, Flex } from '@chakra-ui/react'

export default function Loader() {
  return (
    <Container h="100%" maxWidth="container.md">
      <Flex mt="50%" align="center" justify="center">
        <CircularProgress isIndeterminate color="brand.300" />
      </Flex>
    </Container>
  )
}
