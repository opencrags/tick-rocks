import {
  Box,
  Heading,
  Flex,
  Avatar,
  Text,
  Tooltip,
  Spacer,
  Button,
  Stack,
} from '@chakra-ui/react'
import React from 'react'
import { AddIcon } from '@chakra-ui/icons'
function CragLatestDiscussions({ children, ...props }) {
  return (
    <Box id="cragForum" mt="10px" mb="5px">
      <Box id="cragForum" mt="10px" mb="5px">
        <Flex
          position="sticky"
          top="50px"
          bottom="0px"
          flexWrap="wrap"
          padding="10px"
        >
          <Heading
            color="white"
            size="2xl"
            fontFamily="sans-serif"
            fontWeight="bold"
            letterSpacing="tighter"
            textShadow="3px 3px 3px rgba(0, 0, 0, 0.2)"
          >
            Discussion
          </Heading>
          <Spacer />
          <Stack spacing={2} direction="row" align="center">
            <Button
              display={{ base: 'block', md: 'none' }}
              boxShadow="xl"
              pr={2}
              pl={2}
              colorScheme="green"
            >
              <AddIcon />
            </Button>
            <Button
              display={{ base: 'none', md: 'block' }}
              boxShadow="xl"
              pr={4}
              pl={4}
              colorScheme="green"
              leftIcon={<AddIcon />}
            >
              New post
            </Button>
            <Button boxShadow="xl" pr={4} pl={4} colorScheme="gray">
              View all
            </Button>
          </Stack>
        </Flex>
      </Box>

      <Flex
        color="white"
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        padding="5px"
      >
        <Box bg="gray.600" padding="10px" margin="5px">
          <Flex m="1">
            <Tooltip label="Rasmus E" aria-label="A tooltip">
              <Avatar
                name="Rasmus E"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/62182564_10217135936723107_5145342899025608704_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=eU2XkPusFy4AX9aYd8m&_nc_ht=scontent.fbma2-1.fna&oh=bd399e4af704b6ed3bdf2bdcb0467038&oe=612E3205"
              />
            </Tooltip>
            <Text ml="2">
              Behöver rikitgt soft beta på Rainbow Rocket, någon?
            </Text>
          </Flex>
          <Flex ml="5" mt="2">
            <Tooltip label="Richard L" aria-label="A tooltip">
              <Avatar
                name="Richard L"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/221168110_10158374552417522_582055814329159086_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=8B6QFRj4Z2IAX861-e6&_nc_ht=scontent.fbma2-1.fna&oh=4c4d83f1f00af3cce3488add14c17798&oe=612DFA73"
              />
            </Tooltip>
            <Text ml="2">Expert här</Text>
          </Flex>
          <Flex ml="5" mt="2">
            <Tooltip label="Åke R" aria-label="A tooltip">
              <Avatar
                name="Åke R"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t31.18172-8/920404_10151455603843355_1163235424_o.jpg?_nc_cat=106&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=__whM8sZa-wAX-N_SVY&_nc_ht=scontent.fbma2-1.fna&oh=a4420a9db953e4f66a20aaf74c2b2a6e&oe=612E8092"
              />
            </Tooltip>
            <Text ml="2">Pröva statiskt</Text>
          </Flex>
        </Box>

        <Box bg="gray.600" padding="10px" margin="5px">
          <Flex m="1">
            <Tooltip label="Åke R" aria-label="A tooltip">
              <Avatar
                name="Åke R"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t31.18172-8/920404_10151455603843355_1163235424_o.jpg?_nc_cat=106&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=__whM8sZa-wAX-N_SVY&_nc_ht=scontent.fbma2-1.fna&oh=a4420a9db953e4f66a20aaf74c2b2a6e&oe=612E8092"
              />
            </Tooltip>
            <Text ml="2">
              Någon som vill bygga en hemsida som konkurrerar ut 27c?
            </Text>
          </Flex>
          <Flex ml="5" mt="2">
            <Tooltip label="Richard L" aria-label="A tooltip">
              <Avatar
                name="Richard L"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/221168110_10158374552417522_582055814329159086_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=8B6QFRj4Z2IAX861-e6&_nc_ht=scontent.fbma2-1.fna&oh=4c4d83f1f00af3cce3488add14c17798&oe=612DFA73"
              />
            </Tooltip>
            <Text ml="2">Jag har redan skapat en git och köpt domänen.</Text>
          </Flex>
          <Flex ml="5" mt="2">
            <Tooltip label="Rasmus E" aria-label="A tooltip">
              <Avatar
                name="Rasmus E"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/62182564_10217135936723107_5145342899025608704_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=eU2XkPusFy4AX9aYd8m&_nc_ht=scontent.fbma2-1.fna&oh=bd399e4af704b6ed3bdf2bdcb0467038&oe=612E3205"
              />
            </Tooltip>
            <Text ml="2">Kuuuuul</Text>
          </Flex>
        </Box>

        <Box bg="gray.600" padding="10px" margin="5px">
          <Flex m="1">
            <Tooltip label="Richard L" aria-label="A tooltip">
              <Avatar
                name="Richard L"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/221168110_10158374552417522_582055814329159086_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=8B6QFRj4Z2IAX861-e6&_nc_ht=scontent.fbma2-1.fna&oh=4c4d83f1f00af3cce3488add14c17798&oe=612DFA73"
              />
            </Tooltip>
            <Text ml="2">
              Är där om 10 men glömde tejp, kan någon SNÄLLA ta med???
            </Text>
          </Flex>
          <Flex ml="5" mt="2">
            <Tooltip label="Åke R" aria-label="A tooltip">
              <Avatar
                name="Åke R"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t31.18172-8/920404_10151455603843355_1163235424_o.jpg?_nc_cat=106&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=__whM8sZa-wAX-N_SVY&_nc_ht=scontent.fbma2-1.fna&oh=a4420a9db953e4f66a20aaf74c2b2a6e&oe=612E8092"
              />
            </Tooltip>
            <Text ml="2">Riktigt oproffisgt.</Text>
          </Flex>
          <Flex ml="5" mt="2">
            <Tooltip label="Rasmus E" aria-label="A tooltip">
              <Avatar
                name="Rasmus E"
                src="https://scontent.fbma2-1.fna.fbcdn.net/v/t1.6435-9/62182564_10217135936723107_5145342899025608704_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=eU2XkPusFy4AX9aYd8m&_nc_ht=scontent.fbma2-1.fna&oh=bd399e4af704b6ed3bdf2bdcb0467038&oe=612E3205"
              />
            </Tooltip>
            <Text ml="2">Usch.</Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export { CragLatestDiscussions }
