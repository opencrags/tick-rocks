import { Box } from '@chakra-ui/react'

export function VideoIcon({ color, h, w, mr, props }) {
  const newColor = color || '#fff'
  const newH = h || '15px'
  const newW = w || '20px'
  const newMr = mr || '1px'
  return (
    <Box h={newH} w={newW} mr={newMr} {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
        <path
          fill={newColor}
          d="M67.571 410.22c-.572-.0859-2.4442-.3613-4.1602-.612-3.9843-.5821-10.0955-2.5183-14.3526-4.5473-15.9468-7.6004-27.4472-22.7436-30.6358-40.34-.8403-4.6371-.8403-223.3394 0-227.9766 4.1561-22.9353 22.053-40.8323 44.9884-44.9883 4.6372-.8403 223.3395-.8403 227.9766 0 20.1539 3.652 36.6505 17.9606 43.0066 37.3023 2.5265 7.6883 2.464 6.6921 2.6376 42.0698.0844 17.209-.1373 7.2703-.2543 32.9905 25.9643-18.3418 11.5214-8.2264 48.4217-33.8192 11.898-8.2518 39.1142-27.1406 60.4802-41.9752 21.366-14.8347 38.917-26.9025 39.002-26.8174.0852.085.1077 67.207.0502 149.16-.0614 87.4242-.0165 92.4682.004 149.3044-27.8932-19.3262-29.887-20.8322-50.8627-35.2957-27.9147-19.2481-61.004-42.0887-73.532-50.7568-12.5278-8.6682-22.8615-15.7602-22.9637-15.7602-.1021 0-.2576 14.5553-.3455 32.3452-.174 35.1932-.1126 34.2194-2.6377 41.9033-5.5006 16.7383-18.5822 29.82-35.3206 35.3205-8.272 2.7183 1.8076 2.5018-120.0102 2.5788-60.7487.0384-110.9202 0-111.4923-.0862z"
        />
      </svg>
    </Box>
  )
}
