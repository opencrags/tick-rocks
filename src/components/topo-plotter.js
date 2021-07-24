import { useCallback } from 'react'
import { drawBeizerSplines } from '../utils/splines'
import LineImage from './line-image'

export default function TopoPlotter({
  image,
  currentPoints,
  setCurrentPoints,
  lines,
}) {
  const draw = useCallback(
    (ctx) => {
      ctx.fillStyle = '#ECC94B'
      currentPoints.forEach((point) => {
        const { x, y } = {
          x: point.x * ctx.canvas.width,
          y: point.y * ctx.canvas.height,
        }
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI, false)
        ctx.fill()
      })

      drawBeizerSplines(ctx, currentPoints, 0.5, '#ECC94B', 3)
    },
    [currentPoints]
  )

  const handleMouseUp = (event) => {
    const canvas = event.target
    const bounds = canvas.getBoundingClientRect()
    const mouseX = event.pageX - bounds.left - window.scrollX
    const mouseY = event.pageY - bounds.top - window.scrollY
    setCurrentPoints((previousPoints) => [
      ...previousPoints,
      {
        x: mouseX / canvas.width,
        y: mouseY / canvas.height,
      },
    ])
  }

  return (
    <LineImage
      image={image}
      lines={lines}
      draw={draw}
      onMouseUp={handleMouseUp}
    />
  )
}
