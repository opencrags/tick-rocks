import { Box } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import useWindowSize from '../hooks/useWindowSize'
import { drawBeizerSplines, validateLine } from '../utils/splines'

import { mostVoted } from '../utils/backend'

export default function LineImage({ image, lines, draw, ...props }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const canvasRef = useRef()
  const imageRef = useRef()
  const windowSize = useWindowSize()

  if (!lines) {
    lines = []
  } else if (!Array.isArray(lines)) {
    lines = [lines]
  }

  const parsedLines = lines.flatMap((line) => {
    try {
      const parsedLine = mostVoted(line.line_path_votes)
      if (validateLine(parsedLine)) {
        return [parsedLine]
      } else {
        return []
      }
    } catch (error) {
      return []
    }
  })

  const drawLines = useCallback(() => {
    if (!imageLoaded || !canvasRef.current) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const standardColor = '#ED2939'

    parsedLines.forEach((line) => {
      drawBeizerSplines(ctx, line, 0.5, standardColor, 3)
    })

    parsedLines.forEach((line, index) => {
      const x = line[0].x * ctx.canvas.width
      const y = line[0].y * ctx.canvas.height
      ctx.beginPath()
      ctx.fillStyle = '#252A32'
      ctx.arc(x, y, 12, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.beginPath()
      ctx.strokeStyle = standardColor
      ctx.lineWidth = 3
      ctx.arc(x, y, 12, 0, 2 * Math.PI, false)
      ctx.stroke()
      ctx.fillStyle = 'white'
      ctx.font = '20px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${index + 1}`, x, y)
    })

    if (draw) {
      draw(ctx)
    }
  }, [parsedLines, draw, imageLoaded])

  useEffect(() => {
    console.log('window size effect')
    if (!imageLoaded) {
      return
    }
    const { width } = canvasRef.current.getBoundingClientRect()
    // Set the canvas HTML width attribute to agree with its CSS width value
    // see: https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-width
    canvasRef.current.width = width
    const aspectRatio = imageRef.current.height / imageRef.current.width
    canvasRef.current.style.height = `${Math.round(aspectRatio * width)}px`
    canvasRef.current.height = Math.round(aspectRatio * width)
    requestAnimationFrame(drawLines)
  }, [windowSize, imageLoaded, drawLines])

  useEffect(() => {
    console.log('animation effect')
    if (!imageLoaded) {
      return
    }

    requestAnimationFrame(drawLines)
  }, [drawLines, imageLoaded])

  return (
    <Box position="relative">
      <Image
        ref={imageRef}
        src={image?.base64_image}
        alt="topo"
        onLoad={() => setImageLoaded(true)}
      />

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        {...props}
      ></canvas>
    </Box>
  )
}
