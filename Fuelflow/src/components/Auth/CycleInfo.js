import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  styled,
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Styled components for enhanced visuals
const GlowingPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    transform: 'translateY(-2px)',
  },
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 20px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 20px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const CycleInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [cycleData, setCycleData] = useState({
    lastPeriodDate: null,
    nextPeriodDate: null,
    periodLength: '',
  });
  const [error, setError] = useState(null);

  const steps = ['Last Period', 'Next Period', 'Period Length'];

  const handleDateChange = (field, date) => {
    setCycleData(prev => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Here we'll integrate with the Rapid API for phase calculations
      // For now, we'll just store the cycle information
      const updatedUser = {
        ...user,
        cycleInfo: {
          lastPeriodDate: cycleData.lastPeriodDate,
          nextPeriodDate: cycleData.nextPeriodDate,
          periodLength: parseInt(cycleData.periodLength),
          // We'll add phase information here later when we integrate the Rapid API
          currentPhase: 'To be calculated',
        },
      };
      
      updateUser(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating cycle information:', error);
      setError('Failed to update cycle information. Please try again.');
    }
    setLoading(false);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const isStepComplete = () => {
    switch (activeStep) {
      case 0:
        return !!cycleData.lastPeriodDate;
      case 1:
        return !!cycleData.nextPeriodDate;
      case 2:
        return !!cycleData.periodLength;
      default:
        return false;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxWidth="md"
        sx={{ mt: 4, mb: 4 }}
      >
        <GlowingPaper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Typography
            variant="h4"
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            gutterBottom
            sx={{
              textAlign: 'center',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
            }}
          >
            Complete Your Cycle Information
          </Typography>

          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.primary.main,
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.secondary.main,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box
            component={motion.div}
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            sx={{ mt: 4 }}
          >
            {activeStep === 0 && (
              <DatePicker
                label="When did your last period start?"
                value={cycleData.lastPeriodDate}
                onChange={(date) => handleDateChange('lastPeriodDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: { mb: 2 },
                  },
                }}
              />
            )}

            {activeStep === 1 && (
              <DatePicker
                label="When is your next period expected?"
                value={cycleData.nextPeriodDate}
                onChange={(date) => handleDateChange('nextPeriodDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: { mb: 2 },
                  },
                }}
              />
            )}

            {activeStep === 2 && (
              <AnimatedTextField
                fullWidth
                required
                label="How many days does your period typically last?"
                type="number"
                value={cycleData.periodLength}
                onChange={(e) => handleDateChange('periodLength', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!isStepComplete() || loading}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Complete Setup'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepComplete()}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                Next
              </Button>
            )}
          </Box>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </GlowingPaper>
      </Container>
    </LocalizationProvider>
  );
};

export default CycleInfo;
