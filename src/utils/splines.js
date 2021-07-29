export const LINE_COLOR = '#ED2939'
export const SELECTED_COLOR = '#ECC94B'

function calculateControlPoints(x0, y0, x1, y1, x2, y2, t = 0.5) {
  const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))
  const d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  const fa = (t * d01) / (d01 + d12) // scaling factor for triangle Ta
  const fb = (t * d12) / (d01 + d12) // ditto for Tb, simplifies to fb=t-fa
  const p1x = x1 - fa * (x2 - x0) // x2-x0 is the width of triangle T
  const p1y = y1 - fa * (y2 - y0) // y2-y0 is the height of T
  const p2x = x1 + fb * (x2 - x0)
  const p2y = y1 + fb * (y2 - y0)
  return [
    { x: p1x, y: p1y },
    { x: p2x, y: p2y },
  ]
}

export const drawBeizerSplines = (
  ctx,
  { t = 0.5, color = '#ECC94B', lineWidth = 6 },
  relativePoints
) => {
  // For details, see http://scaledinnovation.com/analytics/splines/aboutSplines.html
  if (relativePoints.length < 2) {
    return
  }

  const points = relativePoints.map((point) => ({
    x: ctx.canvas.width * point.x,
    y: ctx.canvas.height * point.y,
  }))

  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y)
    ctx.stroke()
    return
  }

  let controlPoints = []
  for (let i = 0; i < points.length - 2; i++) {
    controlPoints = controlPoints.concat(
      calculateControlPoints(
        points[i].x,
        points[i].y,
        points[i + 1].x,
        points[i + 1].y,
        points[i + 2].x,
        points[i + 2].y,
        t
      )
    )
  }

  ctx.quadraticCurveTo(
    controlPoints[0].x,
    controlPoints[0].y,
    points[1].x,
    points[1].y
  )
  ctx.stroke()
  for (let i = 1; i < points.length - 2; i++) {
    ctx.bezierCurveTo(
      controlPoints[2 * i - 1].x,
      controlPoints[2 * i - 1].y,
      controlPoints[2 * i].x,
      controlPoints[2 * i].y,
      points[i + 1].x,
      points[i + 1].y
    )
    ctx.stroke()
  }

  ctx.quadraticCurveTo(
    controlPoints[controlPoints.length - 1].x,
    controlPoints[controlPoints.length - 1].y,
    points[points.length - 1].x,
    points[points.length - 1].y
  )
  ctx.stroke()
}

export const drawMarkers = (
  ctx,
  {
    fontColor = 'white',
    font = '20px serif',
    backgroundColor = '#252A32',
    markerColor = '#ED2939',
    markerSize = 12,
  },
  line,
  index
) => {
  const x = line[0].x * ctx.canvas.width
  const y = line[0].y * ctx.canvas.height
  ctx.beginPath()
  ctx.fillStyle = backgroundColor
  ctx.arc(x, y, markerSize, 0, 2 * Math.PI, false)
  ctx.fill()
  ctx.beginPath()
  ctx.strokeStyle = markerColor
  ctx.lineWidth = 3
  ctx.arc(x, y, markerSize, 0, 2 * Math.PI, false)
  ctx.stroke()
  ctx.fillStyle = fontColor
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${index + 1}`, x, y)
}

export const drawPathPoints = (ctx, { color = '#ECC94B' }, path) => {
  ctx.fillStyle = color
  path.forEach((point) => {
    const { x, y } = {
      x: point.x * ctx.canvas.width,
      y: point.y * ctx.canvas.height,
    }
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, 2 * Math.PI, false)
    ctx.fill()
  })
}
