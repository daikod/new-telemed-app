import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const HospitalList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        state: '',
        type: '',
        searchTerm: ''
    });

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const { data } = await axios.get('/api/hospitals', { params: filters });
            setHospitals(data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch hospitals', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Hospitals</h1>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Search hospitals..."
                    className="p-2 border rounded"
                    onChange={handleFilterChange}
                />
                <select
                    name="state"
                    className="p-2 border rounded"
                    onChange={handleFilterChange}
                >
                    <option value="">All States</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Oyo">Oyo</option>
                    {/* Add more states */}
                </select>
                <select
                    name="type"
                    className="p-2 border rounded"
                    onChange={handleFilterChange}
                >
                    <option value="">All Types</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="tertiary">Tertiary</option>
                </select>
            </div>

            {/* Hospital List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map(hospital => (
                    <div key={hospital.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{hospital.name}</h2>
                            <p className="text-gray-600 mb-2">{hospital.address}</p>
                            <p className="text-gray-500 mb-2">
                                {hospital.city}, {hospital.state}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm font-medium text-indigo-600 capitalize">
                                    {hospital.type} Care
                                </span>
                                <button
                                    onClick={() => window.location.href = `/hospitals/${hospital.id}`}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalList; 