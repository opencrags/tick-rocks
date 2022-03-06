import { Box } from '@chakra-ui/react'
import { CragComponentBox } from '../components/crag-component-box.js'
import Feed from '../components/feed.js'
import { PageFooter } from '../components/page-footer.js'

export default function FeedPage() {
  return (
    <>
      <Box h="100%">
        <CragComponentBox pt="10px">
          <Feed filter="" />
        </CragComponentBox>
        <PageFooter />
      </Box>
    </>
  )
}
