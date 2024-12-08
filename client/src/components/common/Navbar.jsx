import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Swal.fire('Success', 'Logged out successfully', 'success');
        navigate('/login');
    };

    if (!user.id) return null;

    return (
        <nav className="bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-xl">
                            Telemedicine App
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link to="/" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                    Dashboard
                                </Link>
                                <Link to="/appointments/schedule" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                    Schedule Appointment
                                </Link>
                                <Link to="/doctors" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                    Doctors
                                </Link>
                                <Link to="/hospitals" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                    Hospitals
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-white mr-4">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 