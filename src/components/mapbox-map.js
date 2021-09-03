import { Box } from '@chakra-ui/react'
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import useCallbackRef from '../hooks/use-callback-ref'

export default function MapboxMap({
  lng = 17.194966,
  lat = 59.821977,
  zoom = 8,
  onMapLoad,
  mapEffects,
  deps,
  h = '50vh',
}) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [stylesLoaded, setStylesLoaded] = useState(false)
  const mapContainer = useRef()
  const mapboxMap = useRef()
  const onLoad = useCallbackRef(onMapLoad)
  const effects = useCallbackRef(mapEffects)

  useEffect(() => {
    if (mapboxMap.current) {
      return
    }

    mapboxMap.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/trabuchhobbes/ckml1bv0s28tu17ntgo22j7i9',
      center: [lng, lat],
      attributionControl: false,
      zoom,
    })

    setMapLoaded(true)

    return () => mapboxMap.current.remove()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoad])

  useEffect(() => {
    if (!mapLoaded) return

    mapboxMap.current.on('load', () => {
      mapboxMap.current.addControl(
        new mapboxgl.AttributionControl(),
        'top-left'
      )

      onLoad(mapboxMap.current)
    })

    mapboxMap.current.on('styledata', () => {
      setStylesLoaded(true)
    })
  }, [mapLoaded, onLoad])

  useEffect(() => {
    if (!mapLoaded || !stylesLoaded) return

    effects(mapboxMap.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, zoom, effects, ...deps, stylesLoaded, mapLoaded])

  return <Box ref={mapContainer} className="map-container" h={h} />
}
