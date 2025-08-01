import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AgentDashboard from './pages/AgentDashboard';
import AgentManagement from './pages/AgentManagement';
import FileUpload from './pages/FileUpload';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/agent-dashboard" 
                element={
                  <PrivateRoute>
                    <AgentDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/agents" 
                element={
                  <PrivateRoute>
                    <AgentManagement />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <PrivateRoute>
                    <FileUpload />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
