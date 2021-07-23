// Stolen from https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
import { useEffect, useState } from 'react'

export default function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}
