import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Grid,
  Alert,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    height: '',
    weight: '',
    dietType: '',
    allergens: [],
    preferences: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergenChange = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (tabValue === 0) { // Login
      if (!formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      login(formData);
      navigate('/dashboard');
    } else { // Register
      if (!formData.email || !formData.password || !formData.name || !formData.height || !formData.weight || !formData.dietType) {
        setError('Please fill in all required fields');
        return;
      }
      register(formData);
      navigate('/cycle-info');
    }
  };

  const allergenOptions = [
    'Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
    'Peanuts', 'Wheat', 'Soy'
  ];

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {tabValue === 0 ? (
          // Login Form
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
              Welcome back to FuelFlow
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: '#FF69B4',
                '&:hover': {
                  backgroundColor: '#FF1493',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        ) : (
          // Registration Form
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
              Join FuelFlow
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Dietary Preference</InputLabel>
                  <Select
                    value={formData.dietType}
                    label="Dietary Preference"
                    onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                  >
                    <MenuItem value="omnivore">Omnivore</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Allergens
                </Typography>
                <FormGroup>
                  <Grid container>
                    {allergenOptions.map((allergen) => (
                      <Grid item xs={6} key={allergen}>
                        <FormControlLabel
                          control={<Checkbox checked={formData.allergens.includes(allergen)} onChange={() => handleAllergenChange(allergen)} />}
                          label={allergen}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Food Preferences/Restrictions"
                  name="preferences"
                  multiline
                  rows={3}
                  value={formData.preferences}
                  onChange={handleChange}
                  placeholder="Enter any additional food preferences or restrictions..."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#FF69B4',
                '&:hover': {
                  backgroundColor: '#FF1493',
                },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
