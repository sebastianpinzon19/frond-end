import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar/Navbar';
import NavbarRoutes from './routes/NavbarRoutes';
import Footer from './components/footer/footer';
import theme from './theme/theme';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div className="content">
          <NavbarRoutes />
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;