import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AppointmentScheduler = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('/api/doctors');
            setDoctors(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch doctors', 'error');
        }
    };

    const fetchAvailableSlots = async (doctorId, date) => {
        try {
            const response = await axios.get(`/api/appointments/available-slots`, {
                params: { doctorId, date: date.toISOString() }
            });
            setAvailableSlots(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch available slots', 'error');
        }
    };

    const handleSchedule = async (slot) => {
        try {
            // Validate slot time is in the future
            if (new Date(slot) <= new Date()) {
                throw new Error('Cannot schedule appointments in the past');
            }

            // Check if doctor is selected
            if (!selectedDoctor) {
                throw new Error('Please select a doctor');
            }

            // Add loading state
            setIsLoading(true);

            const response = await axios.post('/api/appointments', {
                doctorId: selectedDoctor,
                appointmentDate: slot
            });

            Swal.fire('Success', 'Appointment scheduled successfully!', 'success');
            
            // Refresh available slots
            await fetchAvailableSlots(selectedDoctor, selectedDate);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Schedule Appointment</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                        <option value="">Select a doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                                Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialty}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => {
                            setSelectedDate(date);
                            if (selectedDoctor) {
                                fetchAvailableSlots(selectedDoctor, date);
                            }
                        }}
                        minDate={new Date()}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                {availableSlots.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Available Slots</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {availableSlots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => handleSchedule(slot)}
                                    className="p-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    {new Date(slot).toLocaleTimeString()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentScheduler; 