import { AgGridColumn, AgGridReact } from 'ag-grid-react'
import { CragBanner, CragBannerMenu } from '../components/crag-banner'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex, LinkBox, Heading, Text } from '@chakra-ui/layout'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useCrag, mostVoted, useClimbs } from '../utils/backend'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

export default function CragList() {
  const { cragId } = useParams()
  const { crag, error: errorCrag } = useCrag(cragId)
  const bg = useColorModeValue('offwhite', 'gray.700')
  const boxBg = useColorModeValue('gray.300', 'gray.600')
  const { climbs, error: errorClimbs } = useClimbs({ crag_id: cragId })
  console.log(climbs)
  if (crag === undefined) {
    return ''
  }

  if (errorCrag) {
    return <Text>Error</Text>
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
              List of:{' '}
              {crag.name_votes.length >= 1
                ? mostVoted(crag.name_votes)
                : 'No name votes'}
            </Heading>
          </LinkBox>
        </CragBanner>
        <CragBannerMenu></CragBannerMenu>
        <Flex
          pl={{
            md: '15vw',
            base: '20px',
          }}
          pr={{
            md: '15vw',
            base: '20px',
          }}
          position="relative"
          justify="space-between"
        >
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: '100%' }}
          >
            <AgGridReact rowData={climbs}>
              <AgGridColumn
                field="name_votes"
                sortable={true}
                filter={true}
              ></AgGridColumn>
              <AgGridColumn
                field="most_voted_grade"
                sortable={true}
                filter={true}
              ></AgGridColumn>
              <AgGridColumn
                field="average_rating"
                sortable={true}
                filter={true}
              ></AgGridColumn>
              <AgGridColumn
                field="sector_id"
                sortable={true}
                filter={true}
              ></AgGridColumn>
            </AgGridReact>
          </div>
        </Flex>
      </Box>
    </Box>
  )
}