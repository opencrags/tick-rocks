export function addSearchArea(map, searchArea) {
  if (map.getSource('searchArea')) {
    map.getSource('searchArea').setData(searchArea)
  } else {
    map.addSource('searchArea', {
      type: 'geojson',
      data: searchArea,
    })
    map.addLayer({
      id: 'searchArea',
      source: 'searchArea',
      type: 'fill',
      paint: { 'fill-color': '#BF4040', 'fill-opacity': 0.2 },
    })
    map.addLayer({
      id: 'searchArea-outline',
      source: 'searchArea',
      type: 'line',
      paint: {
        'line-width': 1,
        'line-color': '#bf0000',
      },
    })
  }
}

export function removeSearchArea(map) {
  if (map.getSource('searchArea')) {
    map.removeLayer('searchArea')
    map.removeLayer('searchArea-outline')
    map.removeSource('searchArea')
  }
}
