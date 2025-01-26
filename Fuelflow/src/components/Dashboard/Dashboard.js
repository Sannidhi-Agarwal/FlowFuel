import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMealRecommendation = () => {
    navigate('/meal-recommendation');
  };

  const handleMealAnalysis = () => {
    navigate('/meal-analysis');
  };

  const handlePeriodTracker = () => {
    navigate('/period-tracker');  // Navigate to the /period-tracker page
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#FF69B4' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FuelFlow
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.name || 'User'}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            color: '#FF69B4',
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          Welcome to FuelFlow
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
                },
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  backgroundColor: '#FF69B4',
                  position: 'relative',
                }}
              >
                <RestaurantMenuIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 60,
                    color: 'white',
                  }}
                />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Phase-Based Meal Recommendations
                </Typography>
                <Typography>
                  Get personalized dining court meal suggestions based on your menstrual cycle phase.
                  We'll help you make the best food choices for your body's current needs.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleMealRecommendation}
                  sx={{
                    mt: 2,
                    backgroundColor: '#FF69B4',
                    '&:hover': {
                      backgroundColor: '#FF1493',
                    },
                  }}
                >
                  Get Recommendations
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
                },
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  backgroundColor: '#FF69B4',
                  position: 'relative',
                }}
              >
                <CameraAltIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 60,
                    color: 'white',
                  }}
                />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Meal Analysis
                </Typography>
                <Typography>
                  Upload a photo of your meal and get instant feedback on its nutritional value
                  and how well it aligns with your current cycle phase.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleMealAnalysis}
                  sx={{
                    mt: 2,
                    backgroundColor: '#FF69B4',
                    '&:hover': {
                      backgroundColor: '#FF1493',
                    },
                  }}
                >
                  Analyze Meal
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* New button to navigate to Period Tracker page */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handlePeriodTracker}
              sx={{
                mt: 4,
                backgroundColor: '#FF69B4',
                '&:hover': {
                  backgroundColor: '#FF1493',
                },
              }}
            >
              Go to Period Tracker
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
