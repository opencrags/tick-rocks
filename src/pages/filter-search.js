import { HStack } from '@chakra-ui/layout'
import { Flex } from '@chakra-ui/layout'
import { Heading } from '@chakra-ui/layout'
import { Select } from '@chakra-ui/select'
import { useEffect, useState } from 'react'
import { climbTypes } from '../utils/constants'
import SearchMap from '../components/search-map'
import RangeSlider from '../components/range-slider'
import { Center, Container, Text } from '@chakra-ui/react'
import { useGradeSystemGrades, useSearchClimbs } from '../utils/backend'
import Loader from '../components/loader'
import FilterSlider from '../components/filter-slider'
import circleToPolygon from 'circle-to-polygon'
import SearchResults from '../components/search-results'

export default function FilterSearch({ ...props }) {
  const [climbType, setClimbType] = useState('')
  const [drivingDistance, setDrivingDistance] = useState(60)
  const [drivingDistanceEnd, setDrivingDistanceEnd] = useState(60)
  const [linearDistance, setLinearDistance] = useState(100)
  const [linearDistanceEnd, setLinearDistanceEnd] = useState(100)
  const [gradeRange, setGradeRange] = useState([7, 30])
  const [stars, setStars] = useState(0)
  const [ascents, setAscents] = useState(0)
  const [location, setLocation] = useState({
    longitude: 18.103421414223476,
    latitude: 59.356688222237636,
  })
  const [distanceType, setDistanceType] = useState('Linear')
  const [isochrone, setIsochrone] = useState(null)
  const [sphericalArea, setSphericalArea] = useState(
    circleToPolygon(
      [location.longitude, location.latitude],
      linearDistanceEnd * 1000,
      { numberOfEdges: 100 }
    )
  )
  const { gradeSystemGrades, error: errorGradeSystemGrades } =
    useGradeSystemGrades()

  const fontGrades = gradeSystemGrades
    ?.filter(({ system }) => system === 'Fontainebleau grading system')
    .sort((a, b) => a.rank - b.rank)

  const { climbs, searchClimbError } = useSearchClimbs(
    {
      ...(fontGrades && {
        grade_ids: fontGrades.slice(...gradeRange).map(({ id }) => id),
      }),
      ...(distanceType === 'Driving' &&
        isochrone !== null && {
          within_polygon: isochrone.features[0].geometry.coordinates[0],
        }),
    },
    {
      longitude: location.longitude,
      latitude: location.latitude,
      // Don't filter on min rating if it is set to 0 (to
      // include problems with no avg rating).
      ...(stars && { minimum_average_rating: stars }),
      ...(ascents && { minimum_ascents: ascents }),
      ...(distanceType === 'Linear' && { max_distance: linearDistanceEnd }),
    }
  )

  useEffect(() => {
    if (distanceType === 'Linear')
      setSphericalArea(
        circleToPolygon(
          [location.longitude, location.latitude],
          linearDistanceEnd * 1000,
          { numberOfEdges: 100 }
        )
      )
  }, [distanceType, linearDistanceEnd, location.latitude, location.longitude])

  useEffect(() => {
    if (distanceType !== 'Driving') {
      return
    }

    const getIsochrone = async () => {
      const requestString = `https://api.mapbox.com/isochrone/v1/mapbox/driving/${location.longitude}%2C${location.latitude}?contours_minutes=${drivingDistanceEnd}&polygons=true&denoise=1&generalize=500&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      const response = await fetch(requestString).then((res) => res.json())
      setIsochrone(response)
    }

    getIsochrone()
  }, [drivingDistanceEnd, distanceType, location.longitude, location.latitude])

  if (errorGradeSystemGrades || searchClimbError) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load page.</Text>
        </Center>
      </Container>
    )
  }

  if (gradeSystemGrades === undefined) {
    return <Loader />
  }

  const gradeArray = fontGrades?.map(({ grade }) => grade)

  let distanceSlider
  let searchArea

  if (distanceType === 'Linear') {
    distanceSlider = (
      <FilterSlider
        label="Linear distance"
        value={linearDistance}
        onChange={(value) => setLinearDistance(value)}
        onChangeEnd={(value) => setLinearDistanceEnd(value)}
        min={0}
        max={500}
      ></FilterSlider>
    )
    searchArea = sphericalArea
  } else if (distanceType === 'Driving') {
    distanceSlider = (
      <FilterSlider
        label="Driving distance"
        value={drivingDistance}
        onChange={(value) => setDrivingDistance(value)}
        onChangeEnd={(value) => setDrivingDistanceEnd(value)}
        min={10}
        step={5}
        max={60}
      ></FilterSlider>
    )
    searchArea = isochrone
  }

  const handleDistanceTypeChange = (event) => {
    const type = event.target.value
    setDistanceType(type)
    if (type === 'Linear') {
      setSphericalArea(
        circleToPolygon(
          [location.longitude, location.latitude],
          linearDistance * 1000,
          { numberOfEdges: 100 }
        )
      )
    }
  }

  return (
    <Container maxWidth="container.md">
      <Flex direction="column" sx={{ gap: '16px' }} bg="white" {...props}>
        <SearchMap
          location={location}
          setLocation={setLocation}
          searchArea={searchArea}
          climbs={climbs}
        />

        <Select
          placeholder="Type of climb"
          value={climbType}
          onChange={(event) => setClimbType(event.target.value)}
          boxShadow="base"
        >
          {climbTypes.map((climbType) => (
            <option key={climbType} value={climbType}>
              {climbType}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Distance type"
          value={distanceType}
          onChange={handleDistanceTypeChange}
          boxShadow="base"
        >
          <option value="Linear">Linear</option>
          <option value="Driving">Driving</option>
        </Select>

        {distanceSlider}

        <HStack align="center" justify="space-between" mr={0}>
          <Heading ml={4} size="md">
            Grade
          </Heading>
          <RangeSlider
            value={gradeRange}
            onChange={(value) => setGradeRange(value)}
            w="80%"
            fromArray={gradeArray}
          />
        </HStack>

        <FilterSlider
          label="Min rating"
          min={0}
          max={3}
          step={0.1}
          value={stars}
          onChange={(value) => setStars(value)}
        />

        <FilterSlider
          label="Min Ascents"
          min={0}
          max={100}
          value={ascents}
          onChange={(value) => setAscents(value)}
        />

        <SearchResults climbs={climbs} />
      </Flex>
    </Container>
  )
}
