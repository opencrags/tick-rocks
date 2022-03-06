import { useColorModeValue } from '@chakra-ui/color-mode'
import { Flex, Heading, HStack } from '@chakra-ui/layout'
import { Box, Center, Container, Text } from '@chakra-ui/react'
import { Select } from '@chakra-ui/select'
import circleToPolygon from 'circle-to-polygon'
import { useCallback, useEffect, useState } from 'react'
import FilterSlider from '../components/filter-slider'
import Loader from '../components/loader'
import RangeSlider from '../components/range-slider'
import SearchMap from '../components/search-map'
import SearchResults from '../components/search-results'
import { useGradeSystemGrades, useSearchClimbs } from '../utils/backend'
import { climbTypes } from '../utils/constants'

export default function FilterSearch({ ...props }) {
  const [climbType, setClimbType] = useState('')
  const [drivingDistance, setDrivingDistance] = useState(60)
  const [drivingDistanceEnd, setDrivingDistanceEnd] = useState(60)
  const [linearDistance, setLinearDistance] = useState(100)
  const [linearDistanceEnd, setLinearDistanceEnd] = useState(100)
  const [gradeRange, setGradeRange] = useState([7, 30])
  const [gradeRangeEnd, setGradeRangeEnd] = useState([7, 30])
  const [stars, setStars] = useState(0)
  const [starsEnd, setStarsEnd] = useState(0)
  const [ascents, setAscents] = useState(0)
  const [ascentsEnd, setAscentsEnd] = useState(0)
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
  const handleDrivingDistanceChangeEnd = useCallback(
    (value) => setDrivingDistanceEnd(value),
    [setDrivingDistanceEnd]
  )
  const handleLinearDistanceChangeEnd = useCallback(
    (value) => setLinearDistanceEnd(value),
    [setLinearDistanceEnd]
  )
  const handleStarsEnd = useCallback(
    (value) => setStarsEnd(value),
    [setStarsEnd]
  )
  const handleAscentsEnd = useCallback(
    (value) => setAscentsEnd(value),
    [setAscentsEnd]
  )

  const { gradeSystemGrades, error: errorGradeSystemGrades } =
    useGradeSystemGrades()

  const fontGrades = gradeSystemGrades
    ?.filter(({ system }) => system === 'Fontainebleau grading system')
    .sort((a, b) => a.rank - b.rank)

  const getEquivalentGrades = (sliderGrades, gradeRange) => {
    const [lowerBound, upperBound] = gradeRange
    const lowerFuzzyGrade = sliderGrades[lowerBound].fuzzy_unified_rank
    const upperFuzzyGrade = sliderGrades[upperBound].fuzzy_unified_rank

    return gradeSystemGrades.filter(
      (grade) =>
        grade.fuzzy_unified_rank >= lowerFuzzyGrade &&
        grade.fuzzy_unified_rank <= upperFuzzyGrade
    )
  }

  const boxBg = useColorModeValue('offwhite', 'blackAlpha.700')
  const { climbs, searchClimbError } = useSearchClimbs(
    {
      ...(fontGrades && {
        grade_ids: getEquivalentGrades(fontGrades, gradeRangeEnd).map(
          (grade) => grade.id
        ),
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
      ...(starsEnd && { minimum_average_rating: starsEnd }),
      ...(ascentsEnd && { minimum_ascents: ascentsEnd }),
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
        color="black"
        label="Linear distance"
        value={linearDistance}
        onChange={(value) => setLinearDistance(value)}
        onChangeEnd={handleLinearDistanceChangeEnd}
        min={0}
        max={500}
      ></FilterSlider>
    )
    searchArea = sphericalArea
  } else if (distanceType === 'Driving') {
    distanceSlider = (
      <FilterSlider
        color="black"
        label="Driving distance"
        value={drivingDistance}
        onChange={(value) => setDrivingDistance(value)}
        onChangeEnd={handleDrivingDistanceChangeEnd}
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
      <Box
        mt={{ base: '55px', md: '0px' }}
        position="absolute"
        left="0px"
        top="0px"
        h={{ base: '30vh', xxs: '40vh', md: '100vh' }}
        w="100%"
      >
        <SearchMap
          h="100%"
          location={location}
          setLocation={setLocation}
          searchArea={searchArea}
          climbs={climbs}
        />
      </Box>
      <Box
        overflowY={{ base: 'auto', md: 'hidden' }}
        height={{ base: '100%', md: '80vh' }}
        ml={{ base: '0px', md: '10px' }}
        mt={{ base: '30vh', xxs: '40vh', md: '10px' }}
        mb={{ base: '0px', md: '10px' }}
        borderRadius="10px"
        padding="10px"
        w={{ base: '100%', md: '20vw' }}
        position={{ base: 'block', md: 'absolute' }}
        left="0px"
        top="100px"
        zIndex="overlay"
        bg={boxBg}
        boxShadow="base"
      >
        <Flex direction="column" sx={{ gap: '16px' }} {...props}>
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
              color="black"
              value={gradeRange}
              onChange={(value) => setGradeRange(value)}
              onChangeEnd={(value) => setGradeRangeEnd(value)}
              w="80%"
              fromArray={gradeArray}
            />
          </HStack>

          <FilterSlider
            color="black"
            label="Min rating"
            min={0}
            max={5}
            step={0.5}
            value={stars}
            onChange={(value) => setStars(value)}
            onChangeEnd={handleStarsEnd}
          />

          <FilterSlider
            color="black"
            label="Min Ascents"
            min={0}
            max={100}
            value={ascents}
            onChange={(value) => setAscents(value)}
            onChangeEnd={handleAscentsEnd}
          />

          <SearchResults climbs={climbs} />
        </Flex>
      </Box>
    </Container>
  )
}
