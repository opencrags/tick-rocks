import mapboxgl from 'mapbox-gl'

export function addLocationMarker(map, lat, lng, setLocation) {
  const marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat([lng, lat])
    .addTo(map)

  marker.on('dragend', () => {
    const lnglat = marker.getLngLat()
    setLocation({
      longitude: lnglat.lng,
      latitude: lnglat.lat,
    })
  })
}
