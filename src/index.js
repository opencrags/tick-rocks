import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app.js'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'
import Auth0ProviderWithHistory from './components/auth0-provider.js'
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl'
import './styles/mapbox.css'
import theme from './styles/theme.js'

import { ColorModeScript } from '@chakra-ui/react'
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
