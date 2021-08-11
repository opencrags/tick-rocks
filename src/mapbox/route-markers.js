export function addRouteMarkers(map, routesFeatures) {
  if (map.getSource('routes')) {
    map.getSource('routes').setData(routesFeatures)
  } else {
    map.addSource('routes', {
      type: 'geojson',
      data: routesFeatures,
    })

    map.addLayer({
      id: 'routes',
      type: 'symbol',
      source: 'routes',
      layout: {
        'icon-image': 'mapbox-marker-icon-green',
        'icon-anchor': 'center',
        'icon-allow-overlap': true,
      },
    })

    map.addLayer({
      id: 'routes-count-overlay',
      type: 'circle',
      source: 'routes',
      filter: ['>', 'climb_count', 1],
      paint: {
        'circle-color': '#cfefcf',
        'circle-radius': 10,
        'circle-stroke-color': 'black',
        'circle-stroke-width': 1,
        'circle-translate': [13, -24],
      },
    })

    map.addLayer({
      id: 'routes-count',
      type: 'symbol',
      source: 'routes',
      filter: ['>', 'climb_count', 1],
      layout: {
        'text-field': '{climb_count}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-anchor': 'center',
        'text-offset': [1.05, -2],
      },
    })
  }
}
