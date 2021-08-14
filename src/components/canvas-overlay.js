import { Box } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import useWindowSize from '../hooks/useWindowSize'

export default function CanvasOverlay({ image, draw, ...props }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const canvasRef = useRef()
  const imageRef = useRef()
  const windowSize = useWindowSize()

  const renderCanvas = useCallback(() => {
    if (!imageLoaded || !canvasRef.current) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')

    if (draw) {
      draw(ctx)
    }
  }, [draw, imageLoaded])

  useEffect(() => {
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
    requestAnimationFrame(renderCanvas)
  }, [windowSize, imageLoaded, renderCanvas])

  useEffect(() => {
    if (!imageLoaded) return

    requestAnimationFrame(renderCanvas)
  }, [renderCanvas, imageLoaded])

  return (
    <Box position="relative" maxWidth="800px">
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
