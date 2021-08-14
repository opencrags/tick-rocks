import {
  Breadcrumb,
  Text,
  BreadcrumbItem,
  BreadcrumbLink,
  Code,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

import {
  useCrag,
  useSector,
  useClimb,
  useImage,
  mostVoted,
} from '../utils/backend.js'

const useCragBreadcrumbs = (cragId) => {
  const { crag, error } = useCrag(cragId)
  return {
    breadcrumbs: crag && [
      { text: mostVoted(crag.name_votes), link: `/crags/${crag.id}` },
    ],
    error: error,
  }
}

const useSectorBreadcrumbs = (sectorId) => {
  const { sector, errorSector } = useSector(sectorId)
  const { crag, errorCrag } = useCrag(sector?.crag_id)
  return {
    breadcrumbs: crag &&
      sector && [
        { text: mostVoted(crag.name_votes), link: `/crags/${crag.id}` },
        {
          text: mostVoted(sector.name_votes),
          link: `/crags/${crag.id}/sectors/${sector.id}`,
        },
      ],
    error: errorCrag || errorSector,
  }
}

const useClimbBreadcrumbs = (climbId) => {
  const { climb, errorClimb } = useClimb(climbId)
  const { sector, errorSector } = useSector(climb?.sector_id)
  const { crag, errorCrag } = useCrag(sector?.crag_id)
  return {
    breadcrumbs: crag &&
      sector &&
      climb && [
        { text: mostVoted(crag.name_votes), link: `/crags/${crag.id}` },
        {
          text: mostVoted(sector.name_votes),
          link: `/crags/${crag.id}/sectors/${sector.id}`,
        },
        {
          text: mostVoted(climb.name_votes),
          link: `/crags/${crag.id}/sectors/${sector.id}/climbs/${climb.id}`,
        },
      ],
    error: errorCrag || errorSector || errorClimb,
  }
}

const useImageBreadcrumbs = (imageId) => {
  const { image, errorImage } = useImage(imageId)
  const { sector, errorSector } = useSector(image?.sector_id)
  const { crag, errorCrag } = useCrag(sector?.crag_id)
  return {
    breadcrumbs: crag &&
      sector &&
      image && [
        { text: mostVoted(crag.name_votes), link: `/crags/${crag.id}` },
        {
          text: mostVoted(sector.name_votes),
          link: `/crags/${crag.id}/sectors/${sector.id}`,
        },
        {
          text: <Code>image-id: {image.id}</Code>,
          link: `/crags/${crag.id}/sectors/${sector.id}/images/${image.id}`,
        },
      ],
    error: errorCrag || errorSector || errorImage,
  }
}

function RockBreadcrumb({ breadcrumbs }) {
  return (
    <Breadcrumb
      fontWeight="normal"
      fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
      letterSpacing="1.2pt"
      fontFamily="sans-serif"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem key={`${breadcrumb.text}&${breadcrumb.link}`}>
          {breadcrumb.link && index !== breadcrumbs.length - 1 ? (
            <BreadcrumbLink as={RouterLink} to={breadcrumb.link}>
              {breadcrumb.text}
            </BreadcrumbLink>
          ) : (
            <Text>{breadcrumb.text}</Text>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}

function CragBreadcrumb({ cragId, extra }) {
  const { breadcrumbs, error } = useCragBreadcrumbs(cragId)

  if (breadcrumbs === undefined) {
    return ''
  }

  if (error) {
    return 'Unable to load breadcrumb'
  }

  return <RockBreadcrumb breadcrumbs={[...breadcrumbs, ...(extra || [])]} />
}

function SectorBreadcrumb({ sectorId, extra }) {
  const { breadcrumbs, error } = useSectorBreadcrumbs(sectorId)

  if (breadcrumbs === undefined) {
    return ''
  }

  if (error) {
    return 'Unable to load breadcrumb'
  }

  return <RockBreadcrumb breadcrumbs={[...breadcrumbs, ...(extra || [])]} />
}

function ClimbBreadcrumb({ climbId, extra }) {
  const { breadcrumbs, error } = useClimbBreadcrumbs(climbId)

  if (breadcrumbs === undefined) {
    return ''
  }

  if (error) {
    return 'Unable to load breadcrumb'
  }

  return <RockBreadcrumb breadcrumbs={[...breadcrumbs, ...(extra || [])]} />
}

function ImageBreadcrumb({ imageId, extra }) {
  const { breadcrumbs, error } = useImageBreadcrumbs(imageId)

  if (breadcrumbs === undefined) {
    return ''
  }

  if (error) {
    return 'Unable to load breadcrumb'
  }

  return <RockBreadcrumb breadcrumbs={[...breadcrumbs, ...(extra || [])]} />
}

export {
  RockBreadcrumb,
  useCragBreadcrumbs,
  useSectorBreadcrumbs,
  useClimbBreadcrumbs,
  CragBreadcrumb,
  SectorBreadcrumb,
  ClimbBreadcrumb,
  ImageBreadcrumb,
}
