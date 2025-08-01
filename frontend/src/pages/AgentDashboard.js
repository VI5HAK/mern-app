import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const AgentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgentTasks();
  }, []);

  const fetchAgentTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/my-tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Agent Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Welcome, {user?.name}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Assigned Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Here are the tasks assigned to you for follow-up.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {tasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
            <AssignmentIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks assigned yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tasks will appear here once they are assigned to you by the admin.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {tasks.map((task, index) => (
              <Grid item xs={12} sm={6} md={4} key={task._id || index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out',
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h3">
                        {task.firstName}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Phone:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {task.phone}
                      </Typography>
                    </Box>

                    {task.notes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Notes:
                        </Typography>
                        <Typography variant="body2">
                          {task.notes}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label="Assigned" 
                        color="primary" 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total Tasks: {tasks.length}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AgentDashboard; 