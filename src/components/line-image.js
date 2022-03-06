import { useCallback } from 'react'
import {
  drawBeizerSplines,
  drawMarkers,
  LINE_COLOR,
  SELECTED_COLOR,
} from '../utils/splines'
import { Flex, Box } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { mostVoted } from '../utils/backend'
import CanvasOverlay from './canvas-overlay'

export default function LineImage({ image, lines, selectedIndex, ...props }) {
  if (!lines) {
    lines = []
  } else if (!Array.isArray(lines)) {
    lines = [lines]
  }

  const parsedLines = lines.map((line) => mostVoted(line.line_path_votes))

  const draw = useCallback(
    (ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      parsedLines.forEach((line, index) => {
        const color = index === selectedIndex ? SELECTED_COLOR : LINE_COLOR
        drawBeizerSplines(ctx, { color, lineWidth: 3 }, line)
        drawMarkers(ctx, { markerColor: color }, line, index)
      })
    },
    [parsedLines, selectedIndex]
  )

  return (
    <Box style={{ position: 'relative' }}>
      <CanvasOverlay image={image} draw={draw} {...props} />
      <Flex
        padding="10px"
        justify="space-between"
        alignItems="center"
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        <Box>
          <IconButton
            colorScheme="brand"
            color="white"
            as={RouterLink}
            to={`/crags/${image.id}/sectors/${image.id}/images/${image.id}/add-line`}
            size="sm"
            icon={<EditIcon />}
          />
        </Box>
      </Flex>
    </Box>
  )
}
