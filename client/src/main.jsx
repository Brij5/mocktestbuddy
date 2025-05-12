import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './store/store.js'
import './index.css'
import RoutesComponent from './routes/index.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#dc004e', 
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}> 
        <CssBaseline /> 
        <BrowserRouter>
          <RoutesComponent />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
