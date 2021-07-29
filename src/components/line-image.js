import { useCallback } from 'react'
import {
  drawBeizerSplines,
  drawMarkers,
  LINE_COLOR,
  SELECTED_COLOR,
} from '../utils/splines'

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

  return <CanvasOverlay image={image} draw={draw} {...props} />
}
