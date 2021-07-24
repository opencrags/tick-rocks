import { Container, Center, Spinner } from '@chakra-ui/react'

export default function Loader() {
  return (
    <Container maxWidth="container.md">
      <Center>
        <Spinner margin="20px" />
      </Center>
    </Container>
  )
}
