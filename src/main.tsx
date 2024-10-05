import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import App from './App.tsx'

const theme = createTheme({
  colorSchemes: {
    dark: true
  }
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
)
