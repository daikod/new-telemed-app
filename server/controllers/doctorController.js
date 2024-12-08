const db = require('../config/db');

const doctorController = {
    getAllDoctors: async (req, res) => {
        try {
            const query = `
                SELECT d.*, u.first_name, u.last_name, s.name as specialty, h.name as hospital_name
                FROM doctors d
                JOIN users u ON d.user_id = u.id
                JOIN specialties s ON d.specialty_id = s.id
                JOIN hospitals h ON d.hospital_id = h.id
                WHERE u.role = 'doctor'
            `;
            const [doctors] = await db.query(query);
            res.json(doctors);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDoctorById: async (req, res) => {
        try {
            const { id } = req.params;
            const query = `
                SELECT d.*, u.first_name, u.last_name, u.email,
                       s.name as specialty, h.name as hospital_name
                FROM doctors d
                JOIN users u ON d.user_id = u.id
                JOIN specialties s ON d.specialty_id = s.id
                JOIN hospitals h ON d.hospital_id = h.id
                WHERE d.id = ?
            `;
            const [doctor] = await db.query(query, [id]);
            
            if (!doctor[0]) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
            
            res.json(doctor[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDoctorAvailability: async (req, res) => {
        try {
            const { id } = req.params;
            const { date } = req.query;

            const [appointments] = await db.query(
                'SELECT appointment_date FROM appointments WHERE doctor_id = ? AND DATE(appointment_date) = DATE(?)',
                [id, date]
            );

            // Return booked time slots
            res.json(appointments.map(apt => apt.appointment_date));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateSchedule: async (req, res) => {
        try {
            const { id } = req.params;
            const { schedule } = req.body;
            
            // Validate schedule format
            if (!Array.isArray(schedule) || !schedule.every(slot => slot.day && slot.startTime && slot.endTime)) {
                return res.status(400).json({ message: 'Invalid schedule format' });
            }

            // Validate time format and ranges
            for (const slot of schedule) {
                const startTime = new Date(`1970-01-01T${slot.startTime}`);
                const endTime = new Date(`1970-01-01T${slot.endTime}`);

                if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                    return res.status(400).json({ message: 'Invalid time format' });
                }

                if (endTime <= startTime) {
                    return res.status(400).json({ message: 'End time must be after start time' });
                }
            }

            // Start transaction
            await db.query('START TRANSACTION');

            // Delete existing schedule
            await db.query('DELETE FROM doctor_schedules WHERE doctor_id = ?', [id]);

            // Insert new schedule
            for (const slot of schedule) {
                await db.query(
                    'INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
                    [id, slot.day, slot.startTime, slot.endTime]
                );
            }

            await db.query('COMMIT');
            res.json({ message: 'Schedule updated successfully' });
        } catch (error) {
            await db.query('ROLLBACK');
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = doctorController; 