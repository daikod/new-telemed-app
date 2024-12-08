import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import AppointmentScheduler from './components/appointments/AppointmentScheduler';
import VideoConference from './components/video/VideoConference';
import DoctorProfile from './components/doctors/DoctorProfile';
import HospitalList from './components/hospitals/HospitalList';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/appointments/schedule" element={
                        <PrivateRoute>
                            <AppointmentScheduler />
                        </PrivateRoute>
                    } />
                    <Route path="/video/:appointmentId" element={
                        <PrivateRoute>
                            <VideoConference />
                        </PrivateRoute>
                    } />
                    <Route path="/doctors/:id" element={
                        <PrivateRoute>
                            <DoctorProfile />
                        </PrivateRoute>
                    } />
                    <Route path="/hospitals" element={
                        <PrivateRoute>
                            <HospitalList />
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App; 