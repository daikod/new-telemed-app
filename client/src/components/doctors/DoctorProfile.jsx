import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const DoctorProfile = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctorProfile();
    }, [id]);

    const fetchDoctorProfile = async () => {
        try {
            const { data } = await axios.get(`/api/doctors/${id}`);
            setDoctor(data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch doctor profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!doctor) {
        return <div>Doctor not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={doctor.profile_image || '/default-avatar.png'}
                            alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">
                                Dr. {doctor.first_name} {doctor.last_name}
                            </h1>
                            <p className="text-gray-600">{doctor.specialty}</p>
                            <p className="text-gray-500">{doctor.hospital_name}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">About</h2>
                        <p className="text-gray-700">{doctor.bio}</p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Specializations</h2>
                        <ul className="list-disc list-inside text-gray-700">
                            {doctor.specializations?.map((spec, index) => (
                                <li key={index}>{spec}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Education & Experience</h2>
                        <div className="text-gray-700">
                            <p>Years of Experience: {doctor.years_of_experience} years</p>
                            <p>License Number: {doctor.license_number}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={() => window.location.href = `/appointments/schedule/${doctor.id}`}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Schedule Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile; 