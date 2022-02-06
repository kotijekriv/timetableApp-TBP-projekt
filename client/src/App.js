import React from 'react';
import { Container } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Auth from './components/Auth/Auth';
import Form from './components/Form/Form';

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#440044',
        light: '#550055',
        dark: '#330033',
        contrastText: '#fff'
      },
      secondary: {
        main: '#AB856F',
        light: '#B8947F',
        dark: '#8A6955',
        contrastText: '#fff'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Container maxWidth='lg'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add-event" element={<Form />} />
            <Route path="/edit-event/:eventId" element={<Form />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
