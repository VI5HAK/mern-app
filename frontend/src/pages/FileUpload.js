import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
        setSuccess('');
      } else {
        setError('Please select a valid CSV, XLS, or XLSX file');
        setFile(null);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
        setError('');
        setSuccess('');
      } else {
        setError('Please select a valid CSV, XLS, or XLSX file');
        setFile(null);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setSuccess(`Successfully uploaded and distributed ${response.data.count} tasks!`);
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            File Upload
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload Task File
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Upload a CSV, XLS, or XLSX file to distribute tasks among your agents.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: file ? 'success.main' : 'grey.300',
            backgroundColor: file ? 'success.light' : 'grey.50',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.light',
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            {file ? 'File Selected' : 'Drag & Drop or Click to Select File'}
          </Typography>
          
          {file ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" color="success.main">
                ✓ {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {(file.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Supported formats: CSV, XLS, XLSX
            </Typography>
          )}
        </Paper>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={!file || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload & Distribute Tasks'}
          </Button>
        </Box>

        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            File Format Requirements
          </Typography>
          <Typography variant="body2" paragraph>
            Your file should contain the following columns:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">
              <strong>FirstName</strong> - The person's first name
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Phone</strong> - Contact phone number
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Notes</strong> - Any additional notes (optional)
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Tasks will be automatically distributed equally among all available agents.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default FileUpload; 