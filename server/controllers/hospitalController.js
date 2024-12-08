const db = require('../config/db');

const hospitalController = {
    getAllHospitals: async (req, res) => {
        try {
            const { state, type, searchTerm } = req.query;
            let query = 'SELECT * FROM hospitals WHERE 1=1';
            const params = [];

            // Validate state
            if (state) {
                if (!['Lagos', 'Abuja', 'Oyo'].includes(state)) {
                    return res.status(400).json({ message: 'Invalid state' });
                }
                query += ' AND state = ?';
                params.push(state);
            }

            // Validate type
            if (type) {
                if (!['primary', 'secondary', 'tertiary'].includes(type)) {
                    return res.status(400).json({ message: 'Invalid hospital type' });
                }
                query += ' AND type = ?';
                params.push(type);
            }

            // Sanitize search term
            if (searchTerm) {
                const sanitizedTerm = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '');
                query += ' AND (name LIKE ? OR city LIKE ?)';
                params.push(`%${sanitizedTerm}%`, `%${sanitizedTerm}%`);
            }

            const [hospitals] = await db.query(query, params);
            res.json(hospitals);
        } catch (error) {
            console.error('Hospital query error:', error);
            res.status(500).json({ message: 'Failed to fetch hospitals' });
        }
    },

    getHospitalById: async (req, res) => {
        try {
            const { id } = req.params;
            const [hospital] = await db.query(
                'SELECT * FROM hospitals WHERE id = ?',
                [id]
            );

            if (!hospital[0]) {
                return res.status(404).json({ message: 'Hospital not found' });
            }

            res.json(hospital[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getHospitalDoctors: async (req, res) => {
        try {
            const { id } = req.params;
            const query = `
                SELECT d.*, u.first_name, u.last_name, s.name as specialty
                FROM doctors d
                JOIN users u ON d.user_id = u.id
                JOIN specialties s ON d.specialty_id = s.id
                WHERE d.hospital_id = ?
            `;
            const [doctors] = await db.query(query, [id]);
            res.json(doctors);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getHospitalDepartments: async (req, res) => {
        try {
            const { id } = req.params;
            const query = `
                SELECT DISTINCT s.id, s.name, s.description,
                       COUNT(d.id) as doctor_count
                FROM specialties s
                LEFT JOIN doctors d ON s.id = d.specialty_id AND d.hospital_id = ?
                WHERE EXISTS (
                    SELECT 1 FROM doctors 
                    WHERE specialty_id = s.id AND hospital_id = ?
                )
                GROUP BY s.id, s.name, s.description
            `;
            
            const [departments] = await db.query(query, [id, id]);
            res.json(departments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = hospitalController; 