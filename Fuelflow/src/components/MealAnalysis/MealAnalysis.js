import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const MealAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    // Will implement Groq AI analysis later
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '#FF69B4',
          fontWeight: 'bold',
          mb: 4
        }}
      >
        Meal Analysis
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              border: '2px dashed #FF69B4',
              borderRadius: 2,
              backgroundColor: 'rgba(255, 105, 180, 0.05)',
            }}
          >
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="meal-photo-upload"
              type="file"
              onChange={handleImageSelect}
            />
            <label htmlFor="meal-photo-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: '#FF69B4',
                  '&:hover': {
                    backgroundColor: '#FF1493',
                  },
                }}
              >
                Upload Meal Photo
              </Button>
            </label>

            {previewUrl && (
              <Box sx={{ mt: 2, position: 'relative', width: '100%', maxWidth: 400 }}>
                <img
                  src={previewUrl}
                  alt="Meal preview"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  onClick={handleImageRemove}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleAnalyze}
            disabled={!selectedImage || loading}
            sx={{
              mt: 3,
              backgroundColor: '#FF69B4',
              '&:hover': {
                backgroundColor: '#FF1493',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Meal'}
          </Button>
        </CardContent>
      </Card>

      {/* Placeholder for analysis results */}
      {analysis && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              <Typography variant="body1">
                The analysis results from Groq AI will be displayed here, including:
                - Nutritional content
                - Alignment with current cycle phase
                - Recommendations for improvement
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default MealAnalysis;
