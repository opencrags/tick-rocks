import { useCallback } from 'react'
import { mostVoted } from '../utils/backend'
import {
  drawBeizerSplines,
  drawMarkers,
  drawPathPoints,
  LINE_COLOR,
  SELECTED_COLOR,
} from '../utils/splines'
import CanvasOverlay from './canvas-overlay'

export default function TopoPlotter({ image, linePath, setLinePath, lines }) {
  const parsedLines = lines?.map((line) => mostVoted(line.line_path_votes))

  const draw = useCallback(
    (ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      parsedLines.forEach((line, index) => {
        drawBeizerSplines(ctx, { color: LINE_COLOR, lineWidth: 3 }, line)
        drawMarkers(ctx, {}, line, index)
      })
      drawBeizerSplines(ctx, { color: SELECTED_COLOR }, linePath)
      drawPathPoints(ctx, { color: SELECTED_COLOR }, linePath)
    },
    [linePath, parsedLines]
  )

  const handleMouseUp = (event) => {
    const canvas = event.target
    const bounds = canvas.getBoundingClientRect()
    const mouseX = event.pageX - bounds.left - window.scrollX
    const mouseY = event.pageY - bounds.top - window.scrollY
    setLinePath((previousPoints) => [
      ...previousPoints,
      {
        x: mouseX / canvas.width,
        y: mouseY / canvas.height,
      },
    ])
  }

  return <CanvasOverlay image={image} draw={draw} onMouseUp={handleMouseUp} />
}
