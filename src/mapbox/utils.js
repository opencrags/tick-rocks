import { groupBy } from '../utils/functions'

export function climbsToGeoJson(climbs) {
  const sectors = Object.values(groupBy(climbs, 'sector_id'))
  return {
    type: 'FeatureCollection',
    features: sectors.map((climbs) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: climbs[0].coordinates },
      properties: {
        climbs,
        climb_count: climbs.length,
      },
    })),
  }
}
