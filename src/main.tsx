import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Store from './context'
import theme from './lib/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Store>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Store>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
