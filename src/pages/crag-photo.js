import { useCragPhoto, mostVoted, useUser, useCrag } from '../utils/backend'
import { Box, Text, Image, Flex, Heading, LinkBox } from '@chakra-ui/react'
import React from 'react'

import { CragBanner, CragBannerMenu } from '../components/crag-banner'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'

import { Link as RouterLink, useParams } from 'react-router-dom'
export default function CragPhoto() {
  const { cragPhotoId, cragId } = useParams()
  const { cragPhoto, error } = useCragPhoto(cragPhotoId)
  const { crag, error: errorCrag } = useCrag(cragId)
  const { user } = useUser(cragPhoto?.user_id)
  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.300', 'gray.600')

  if (cragPhoto === undefined || user === undefined) {
    return ''
  }

  if (error) {
    return <Text>Error fetching photo</Text>
  }
  return (
    <Box>
      <Box>
        <CragBanner cragId={cragId}>
          <LinkBox as={RouterLink} to={`/crags/${cragId}`}>
            <Heading
              textShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
              fontFamily="sans-serif"
              fontWeight="bold"
              letterSpacing="tighter"
            >
              Back to:{' '}
              {crag.name_votes.length >= 1
                ? mostVoted(crag.name_votes)
                : 'No name votes'}
            </Heading>
          </LinkBox>
        </CragBanner>
        <CragBannerMenu></CragBannerMenu>
      </Box>

      <Box>
        <Flex
          justify="center"
          bg={bg}
          direction={{ base: 'column', md: 'row' }}
        >
          <Image src={cragPhoto.base64_image} />
          <Text>Uploaded by: {user.display_name}</Text>
        </Flex>
      </Box>
    </Box>
  )
}
