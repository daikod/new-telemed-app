import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    window.location.href = '/login';
                    return;
                }
                setUser(JSON.parse(userStr));

                const { data } = await axios.get('/api/appointments');
                setUpcomingAppointments(data.filter(apt => 
                    new Date(apt.appointment_date) > new Date() && 
                    apt.status === 'scheduled'
                ));
            } catch (error) {
                Swal.fire('Error', 'Failed to load dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {user?.first_name}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Access your healthcare services and manage appointments
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Link to="/appointments/schedule" 
                        className="bg-indigo-600 text-white rounded-lg p-6 hover:bg-indigo-700 transition">
                        <h2 className="text-xl font-semibold">Schedule Appointment</h2>
                        <p className="mt-2">Book a consultation with a doctor</p>
                    </Link>

                    <Link to="/doctors" 
                        className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition">
                        <h2 className="text-xl font-semibold">Find Doctors</h2>
                        <p className="mt-2">Browse our medical specialists</p>
                    </Link>

                    <Link to="/hospitals" 
                        className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition">
                        <h2 className="text-xl font-semibold">Hospitals</h2>
                        <p className="mt-2">View healthcare facilities</p>
                    </Link>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Upcoming Appointments
                    </h2>
                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.map(appointment => (
                                <div key={appointment.id} 
                                    className="border rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">
                                            Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
                                        </p>
                                        <p className="text-gray-600">
                                            {new Date(appointment.appointment_date).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                    </div>
                                    <div className="space-x-2">
                                        {appointment.meeting_link && (
                                            <Link 
                                                to={`/video/${appointment.id}`}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Join Call
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => window.location.href = `/appointments/${appointment.id}`}
                                            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-200"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No upcoming appointments</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 