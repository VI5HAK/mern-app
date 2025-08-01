import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar
} from '@mui/material';
import {
  People as PeopleIcon,
  Upload as UploadIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Admin menu items
  const adminMenuItems = [
    {
      title: 'Agent Management',
      description: 'Create, view, and manage agents',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/agents',
      color: '#1976d2'
    },
    {
      title: 'File Upload',
      description: 'Upload CSV/XLSX files and distribute tasks',
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      path: '/upload',
      color: '#2e7d32'
    }
  ];

  // Agent menu items
  const agentMenuItems = [
    {
      title: 'My Tasks',
      description: 'View tasks assigned to you',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/agent-dashboard',
      color: '#1976d2'
    }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : agentMenuItems;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Agent Dashboard'}
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
          Welcome to your Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {user?.role === 'admin' 
            ? 'Manage your agents and upload task files to distribute work efficiently.'
            : 'View and manage your assigned tasks for follow-up.'
          }
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: item.color, mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    fullWidth
                    onClick={() => navigate(item.path)}
                  >
                    Open
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 