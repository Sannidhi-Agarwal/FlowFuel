import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const PeriodTracker = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cycleData, setCycleData] = useState(null);
  const [formData, setFormData] = useState({
    cycleStartDate: null,
    nextCycleStartDate: null,
    periodLength: '28',
  });

  const handleDateChange = (field, date) => {
    setFormData(prev => ({
      ...prev,
      [field]: date,
    }));
  };

  const handlePeriodLengthChange = (event) => {
    const value = event.target.value;
    if (value === '' || (Number(value) >= 21 && Number(value) <= 35)) {
      setFormData(prev => ({
        ...prev,
        periodLength: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.cycleStartDate || !formData.nextCycleStartDate) {
      setError('Please select both cycle dates');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.cycleStartDate);
    const nextStartDate = new Date(formData.nextCycleStartDate);
    const periodLength = parseInt(formData.periodLength) || 5; // Default to 5 days if not provided

    // Calculate phase dates
    const periodEndDate = new Date(startDate.getTime() + (periodLength - 1) * 24 * 60 * 60 * 1000); // Period lasts 'periodLength' days
    const follicularStartDate = new Date(periodEndDate.getTime() + 1 * 24 * 60 * 60 * 1000); // Follicular starts after period
    const ovulationStartDate = new Date(nextStartDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Ovulation starts 14 days before next cycle
    const ovulationEndDate = new Date(ovulationStartDate.getTime() + 1 * 24 * 60 * 60 * 1000); // Ovulation lasts 2 days
    const lutealStartDate = new Date(ovulationEndDate.getTime() + 1 * 24 * 60 * 60 * 1000); // Luteal starts after ovulation ends
    const lutealEndDate = new Date(nextStartDate.getTime() - 1 * 24 * 60 * 60 * 1000); // Luteal phase ends the day before the next cycle starts

    const cycleData = {
      prediction: {
        period: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: periodEndDate.toISOString().split('T')[0],
        },
        follicular: {
          start_date: follicularStartDate.toISOString().split('T')[0],
          end_date: ovulationStartDate.toISOString().split('T')[0], // End the follicular phase just before ovulation starts
        },
        ovulation: {
          start_date: ovulationStartDate.toISOString().split('T')[0],
          end_date: ovulationEndDate.toISOString().split('T')[0],
        },
        luteal: {
          start_date: lutealStartDate.toISOString().split('T')[0],
          end_date: lutealEndDate.toISOString().split('T')[0],
        },
      },
      warnings: [],
    };

    setCycleData(cycleData); // Update state with calculated data
    setLoading(false);
  };

  const getCurrentPhase = () => {
    if (!cycleData || !cycleData.prediction) return null;

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Ensure consistent date format

    const phases = [
      { 
        name: 'Menstrual Phase', 
        data: cycleData.prediction.period, 
        color: '#FF69B4', 
        description: 'Day 1 - 6: Period begins, hormone levels are low' 
      },
      { 
        name: 'Follicular Phase', 
        data: cycleData.prediction.follicular, 
        color: '#BA68C8', 
        description: 'Day 7 - 12: Estrogen & Testosterone rises, preparing for ovulation' 
      },
      { 
        name: 'Ovulation Phase', 
        data: cycleData.prediction.ovulation, 
        color: '#9C27B0', 
        description: 'Day 13 - 15:Egg is released, fertility peaks' 
      },
      { 
        name: 'Luteal Phase', 
        data: cycleData.prediction.luteal, 
        color: '#7B1FA2', 
        description: 'Day 16 - 28: Progesterone rises, then all hormones drop' 
      },
    ];

    // Check each phase for the current date
    return phases.find(phase => {
      const { data } = phase;
      if (!data || !data.start_date || !data.end_date) return false;

      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      // Check if today falls within the phase range
      return today >= startDate && today <= endDate;
    });
  };

  const currentPhase = getCurrentPhase();

  if (cycleData) {
    console.log('Cycle Data:', cycleData);

    if (cycleData && cycleData.prediction) {
      const { prediction, warnings } = cycleData;

      return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center' }}>Cycle Predictions</h2>
          <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/* Your form inputs here */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Cycle Phases'}
            </Button>
          </form>
          <Grid container spacing={2}>
            {[
              { name: 'Menstrual Phase', data: cycleData.prediction.period, color: '#FF69B4', description: 'Period begins, hormone levels are low' },
              { name: 'Follicular Phase', data: cycleData.prediction.follicular, color: '#BA68C8', description: 'Estrogen rises, preparing for ovulation' },
              { name: 'Ovulation Phase', data: cycleData.prediction.ovulation, color: '#9C27B0', description: 'Egg is released, fertility peaks' },
              { name: 'Luteal Phase', data: cycleData.prediction.luteal, color: '#7B1FA2', description: 'Progesterone rises, then all hormones drop' },
            ].map((phase) => {
              const today = new Date();
              const isCurrentCycle = today >= new Date(phase.data.start_date) && today <= new Date(phase.data.end_date);
              return (
                <Grid item xs={12} sm={6} md={3} key={phase.name}>
                  <Card style={{ 
                    backgroundColor: phase.color, 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: currentPhase?.name === phase.name ? '2px solid #FFD700' : 'none', 
                    boxShadow: currentPhase?.name === phase.name ? '0 4px 20px rgba(255, 215, 0, 0.5)' : 'none',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}>
                    <h3 style={{ color: '#fff' }}>{phase.name}</h3>
                    <p style={{ color: '#fff' }}>{phase.description}</p>
                    <p style={{ color: '#fff' }}><strong>Start Date:</strong> {phase.data.start_date}</p>
                    <p style={{ color: '#fff' }}><strong>End Date:</strong> {phase.data.end_date}</p>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </div>
      );
    } else {
      return <div>Error: Data not available</div>;
    }
  } else {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
          <Typography variant="h4" gutterBottom sx={{ 
            color: theme.palette.primary.main,
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold'
          }}>
            Period Cycle Tracker
          </Typography>

          <Grid container spacing={4}>
            {/* Input Form */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Enter Your Cycle Information
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <DatePicker
                      label="Last Period Start Date"
                      value={formData.cycleStartDate}
                      onChange={(date) => handleDateChange('cycleStartDate', date)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <DatePicker
                      label="Expected Next Period Date"
                      value={formData.nextCycleStartDate}
                      onChange={(date) => handleDateChange('nextCycleStartDate', date)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Cycle Length (days)"
                      type="number"
                      value={formData.periodLength}
                      onChange={handlePeriodLengthChange}
                      inputProps={{ min: 21, max: 35 }}
                      helperText="Typical cycle length is between 21-35 days"
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #FF69B4 30%, #FF1493 90%)',
                      color: 'white',
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Cycle Phases'}
                  </Button>
                  {error && (
                    <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                      {error}
                    </Typography>
                  )}
                </form>
              </Paper>
            </Grid>

            {/* Results Display */}
            <Grid item xs={12} md={6}>
              {cycleData && (
                <Box>
                  {/* Current Phase Card */}
                  {currentPhase && (
                    <Card 
                      elevation={4}
                      sx={{ 
                        mb: 3,
                        background: `linear-gradient(135deg, ${alpha(currentPhase.color, 0.1)} 0%, ${alpha(currentPhase.color, 0.05)} 100%)`,
                        border: `2px solid ${currentPhase.color}`,
                        borderRadius: 2
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: currentPhase.color }}>
                          Current Phase: {currentPhase.name}
                        </Typography>
                        {currentPhase.data && currentPhase.data.start_date && (
                          <Typography variant="body1">
                            {new Date(currentPhase.data.start_date).toLocaleDateString()}
                            {' - '}
                            {currentPhase.data.end_date && new Date(currentPhase.data.end_date).toLocaleDateString()}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {currentPhase.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* All Phases */}
                  <Grid container spacing={2}>
                    {[
                      { name: 'Menstrual Phase', data: cycleData.prediction.period, color: '#FF69B4', description: 'Period begins, hormone levels are low' },
                      { name: 'Follicular Phase', data: cycleData.prediction.follicular, color: '#BA68C8', description: 'Estrogen rises, preparing for ovulation' },
                      { name: 'Ovulation Phase', data: cycleData.prediction.ovulation, color: '#9C27B0', description: 'Egg is released, fertility peaks' },
                      { name: 'Luteal Phase', data: cycleData.prediction.luteal, color: '#7B1FA2', description: 'Progesterone rises, then all hormones drop' },
                    ].map((phase) => {
                      const today = new Date();
                      const isCurrentCycle = today >= new Date(phase.data.start_date) && today <= new Date(phase.data.end_date);
                      return (
                        <Grid item xs={12} key={phase.name}>
                          <Card 
                            elevation={2}
                            sx={{ 
                              background: currentPhase?.name === phase.name ? `linear-gradient(135deg, ${alpha(phase.color, 0.1)} 0%, ${alpha(phase.color, 0.05)} 100%)` : 'white',
                              border: currentPhase?.name === phase.name ? `2px solid ${phase.color}` : '1px solid #eee',
                              borderRadius: 2
                            }}
                          >
                            <CardContent>
                              <Typography variant="subtitle1" sx={{ color: phase.color, fontWeight: 'bold' }}>
                                {phase.name}
                              </Typography>
                              {phase.data && phase.data.start_date && (
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(phase.data.start_date).toLocaleDateString()}
                                  {' - '}
                                  {phase.data.end_date && new Date(phase.data.end_date).toLocaleDateString()}
                                </Typography>
                              )}
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {phase.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: theme.palette.primary.main,
          textAlign: 'center',
          mb: 4,
          fontWeight: 'bold'
        }}>
          Period Cycle Tracker
        </Typography>

        <Grid container spacing={4}>
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Enter Your Cycle Information
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <DatePicker
                    label="Last Period Start Date"
                    value={formData.cycleStartDate}
                    onChange={(date) => handleDateChange('cycleStartDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <DatePicker
                    label="Expected Next Period Date"
                    value={formData.nextCycleStartDate}
                    onChange={(date) => handleDateChange('nextCycleStartDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Cycle Length (days)"
                    type="number"
                    value={formData.periodLength}
                    onChange={handlePeriodLengthChange}
                    inputProps={{ min: 21, max: 35 }}
                    helperText="Typical cycle length is between 21-35 days"
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(45deg, #FF69B4 30%, #FF1493 90%)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Cycle Phases'}
                </Button>
                {error && (
                  <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                    {error}
                  </Typography>
                )}
              </form>
            </Paper>
          </Grid>

          {/* Results Display */}
          <Grid item xs={12} md={6}>
            {cycleData && (
              <Box>
                {/* Current Phase Card */}
                {currentPhase && (
                  <Card 
                    elevation={4}
                    sx={{ 
                      mb: 3,
                      background: `linear-gradient(135deg, ${alpha(currentPhase.color, 0.1)} 0%, ${alpha(currentPhase.color, 0.05)} 100%)`,
                      border: `2px solid ${currentPhase.color}`,
                      borderRadius: 2
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: currentPhase.color }}>
                        Current Phase: {currentPhase.name}
                      </Typography>
                      {currentPhase.data && currentPhase.data.start_date && (
                        <Typography variant="body1">
                          {new Date(currentPhase.data.start_date).toLocaleDateString()}
                          {' - '}
                          {currentPhase.data.end_date && new Date(currentPhase.data.end_date).toLocaleDateString()}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {currentPhase.description}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* All Phases */}
                <Grid container spacing={2}>
                  {[
                    { name: 'Menstrual Phase', data: cycleData.prediction.period, color: '#FF69B4', description: 'Period begins, hormone levels are low' },
                    { name: 'Follicular Phase', data: cycleData.prediction.follicular, color: '#BA68C8', description: 'Estrogen rises, preparing for ovulation' },
                    { name: 'Ovulation Phase', data: cycleData.prediction.ovulation, color: '#9C27B0', description: 'Egg is released, fertility peaks' },
                    { name: 'Luteal Phase', data: cycleData.prediction.luteal, color: '#7B1FA2', description: 'Progesterone rises, then all hormones drop' },
                  ].map((phase) => {
                    const today = new Date();
                    const isCurrentCycle = today >= new Date(phase.data.start_date) && today <= new Date(phase.data.end_date);
                    return (
                      <Grid item xs={12} key={phase.name}>
                        <Card 
                          elevation={2}
                          sx={{ 
                            background: currentPhase?.name === phase.name ? `linear-gradient(135deg, ${alpha(phase.color, 0.1)} 0%, ${alpha(phase.color, 0.05)} 100%)` : 'white',
                            border: currentPhase?.name === phase.name ? `2px solid ${phase.color}` : '1px solid #eee',
                            borderRadius: 2
                          }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ color: phase.color, fontWeight: 'bold' }}>
                              {phase.name}
                            </Typography>
                            {phase.data && phase.data.start_date && (
                              <Typography variant="body2" color="text.secondary">
                                {new Date(phase.data.start_date).toLocaleDateString()}
                                {' - '}
                                {phase.data.end_date && new Date(phase.data.end_date).toLocaleDateString()}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {phase.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default PeriodTracker;
