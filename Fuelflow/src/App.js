import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import CycleInfo from './components/Auth/CycleInfo';
import Dashboard from './components/Dashboard/Dashboard';
import MealRecommendation from './components/MealRecommendation/MealRecommendation';
import MealAnalysis from './components/MealAnalysis/MealAnalysis';

// Create a custom theme with enhanced aesthetics
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF69B4',
      light: '#FF8DC7',
      dark: '#FF1493',
    },
    secondary: {
      main: '#9C27B0',
      light: '#BA68C8',
      dark: '#7B1FA2',
    },
    background: {
      default: '#FFF5F8',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.25px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(255, 105, 180, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FF69B4, #9C27B0)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF1493, #7B1FA2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(255, 105, 180, 0.1)',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(255, 105, 180, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF69B4',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cycle-info" element={<CycleInfo />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meal-recommendation" element={<MealRecommendation />} />
            <Route path="/meal-analysis" element={<MealAnalysis />} />
            <Route path="/period-tracker" element={<PeriodTracker />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
