import { addLocationMarker } from '../mapbox/add-marker'
import useCallbackRef from '../hooks/use-callback-ref'
import MapboxMap from './mapbox-map'
import { addSearchArea, removeSearchArea } from '../mapbox/isochrone'
import { addRouteMarkers } from '../mapbox/route-markers'
import { climbsToGeoJson } from '../mapbox/utils'
import { useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapPopupPortal from './map-popup-portal'
import MapPopup from './map-popup'

export default function SearchMap({
  searchArea,
  climbs,
  location,
  zoom = 7,
  setLocation,
}) {
  const setLocationCallback = useCallbackRef(setLocation)
  const [popupRoutes, setPopupRoutes] = useState(null)
  const popupRef = useRef(null)

  const onMapLoad = (map) => {
    map.resize()

    addLocationMarker(
      map,
      location.latitude,
      location.longitude,
      setLocationCallback
    )

    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['routes'],
      })
      if (!features.length) {
        setPopupRoutes(null)
        return
      }

      const feature = features[0]

      const popupContainer = window.document.createElement('div')
      popupRef.current = popupContainer

      new mapboxgl.Popup({
        offset: [0, -20],
        maxWidth: '360px',
        closeButton: false,
      })
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent(popupContainer)
        .addTo(map)

      setPopupRoutes(JSON.parse(feature.properties.climbs))
    })
  }

  const mapEffects = (map) => {
    if (searchArea) {
      addSearchArea(map, searchArea)
    } else {
      removeSearchArea(map)
    }

    if (climbs) {
      addRouteMarkers(map, climbsToGeoJson(climbs))
    }
  }

  return (
    <>
      <MapboxMap
        lng={location.longitude}
        lat={location.latitude}
        zoom={zoom}
        onMapLoad={onMapLoad}
        mapEffects={mapEffects}
        deps={[searchArea, climbs]}
      />
      <MapPopupPortal domNode={popupRef.current}>
        <MapPopup climbs={popupRoutes} />
      </MapPopupPortal>
    </>
  )
}
