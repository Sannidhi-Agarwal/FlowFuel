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
  const [currentPhaseName, setCurrentPhaseName] = useState(null); // NEW state for current phase name

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

  // Helper function to calculate current phase based on last period start date and cycle length
  const calculateCurrentPhase = (startDateStr, cycleLength = 28, today = new Date()) => {
    const startDate = new Date(startDateStr);
    if (isNaN(startDate)) return null;

    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const dayInCycle = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;

    if (dayInCycle >= 1 && dayInCycle <= 5) return 'Menstrual Phase';
    else if (dayInCycle >= 6 && dayInCycle <= 13) return 'Follicular Phase';
    else if (dayInCycle >= 14 && dayInCycle <= 16) return 'Ovulation Phase';
    else if (dayInCycle >= 17 && dayInCycle <= cycleLength) return 'Luteal Phase';

    return null;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (!formData.cycleStartDate) {
    setError('Please select your last period start date');
    setLoading(false);
    return;
  }

  const startDate = new Date(formData.cycleStartDate);
  const cycleLength = parseInt(formData.periodLength) || 28;
  const periodLength = 5; // or let user input it separately

  // Calculate expected next period date
  const expectedNextPeriodDate = new Date(startDate);
  expectedNextPeriodDate.setDate(startDate.getDate() + cycleLength);

  // Ovulation starts approx 14 days before next period
  const ovulationStartDay = cycleLength - 14;
  const ovulationLength = 5; // fertile window length

  // Period phase
  const periodStartDate = startDate;
  const periodEndDate = new Date(periodStartDate);
  periodEndDate.setDate(periodEndDate.getDate() + periodLength - 1);

  // Follicular phase
  const follicularStartDate = new Date(periodEndDate);
  follicularStartDate.setDate(follicularStartDate.getDate() + 1);
  const follicularEndDate = new Date(periodStartDate);
  follicularEndDate.setDate(periodStartDate.getDate() + ovulationStartDay - 1);

  // Ovulation phase
  const ovulationStartDate = new Date(periodStartDate);
  ovulationStartDate.setDate(periodStartDate.getDate() + ovulationStartDay);
  const ovulationEndDate = new Date(ovulationStartDate);
  ovulationEndDate.setDate(ovulationStartDate.getDate() + ovulationLength - 1);

  // Luteal phase
  const lutealStartDate = new Date(ovulationEndDate);
  lutealStartDate.setDate(lutealStartDate.getDate() + 1);
  const lutealEndDate = new Date(periodStartDate);
  lutealEndDate.setDate(periodStartDate.getDate() + cycleLength - 1);

  const cycleData = {
    prediction: {
      period: {
        start_date: periodStartDate.toISOString().split('T')[0],
        end_date: periodEndDate.toISOString().split('T')[0],
      },
      follicular: {
        start_date: follicularStartDate.toISOString().split('T')[0],
        end_date: follicularEndDate.toISOString().split('T')[0],
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

  setCycleData(cycleData);

  // Calculate current phase
  const phaseName = calculateCurrentPhase(formData.cycleStartDate, cycleLength);
  setCurrentPhaseName(phaseName);

  setLoading(false);
};


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold',
          }}
        >
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
                    },
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
                {/* Display current phase card */}
                {currentPhaseName && (
                  <Card
                    elevation={4}
                    sx={{
                      mb: 3,
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFFACD 100%)',
                      border: '2px solid #FFD700',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: '#000000' }}>
                        Current Cycle Phase: {currentPhaseName}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* All phases display */}
                <Grid container spacing={2}>
                  {[
                    {
                      name: 'Menstrual Phase',
                      data: cycleData.prediction.period,
                      color: '#FF69B4',
                      description: 'Day 1 - 6: Period begins. Hormone levels drop, and the uterus sheds its lining, which can cause fatigue, cramps, or low mood.',
                    },
                    {
                      name: 'Follicular Phase',
                      data: cycleData.prediction.follicular,
                      color: '#BA68C8',
                      description: 'Day 7 - 12: Estrogen rises, signaling the ovaries to prepare an egg. You may feel more energetic, clear-headed, and motivated.',
                    },
                    {
                      name: 'Ovulation Phase',
                      data: cycleData.prediction.ovulation,
                      color: '#9C27B0',
                      description: 'Day 13 - 15: The ovary releases an egg. This is your most fertile window, often marked by increased libido and cervical mucus changes.',
                    },
                    {
                      name: 'Luteal Phase',
                      data: cycleData.prediction.luteal,
                      color: '#7B1FA2',
                      description: 'Day 16 - 28: Progesterone increases to support pregnancy. If fertilization doesn’t occur, hormones drop, often triggering PMS symptoms.',
                    },
                  ].map((phase) => {
                    const today = new Date();
                    const isCurrentPhase = currentPhaseName === phase.name;

                    return (
                      <Grid item xs={12} key={phase.name}>
                        <Card
                          elevation={2}
                          sx={{
                            background: isCurrentPhase
                              ? `linear-gradient(135deg, ${alpha(phase.color, 0.1)} 0%, ${alpha(phase.color, 0.05)} 100%)`
                              : 'white',
                            border: isCurrentPhase ? `2px solid ${phase.color}` : '1px solid #eee',
                            borderRadius: 2,
                          }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ color: phase.color, fontWeight: 'bold' }}>
                              {phase.name}
                            </Typography>
                            {phase.data && phase.data.start_date && (
                              <Typography variant="body2" color="text.secondary">
                                {new Date(phase.data.start_date).toLocaleDateString()} -{' '}
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
