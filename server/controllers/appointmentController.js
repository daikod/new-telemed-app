const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/email');

const appointmentController = {
    getUserAppointments: async (req, res) => {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            let query;
            if (role === 'patient') {
                query = `
                    SELECT a.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                           s.name as specialty, h.name as hospital_name
                    FROM appointments a
                    JOIN doctors d ON a.doctor_id = d.id
                    JOIN specialties s ON d.specialty_id = s.id
                    JOIN hospitals h ON d.hospital_id = h.id
                    WHERE a.patient_id = ?
                    ORDER BY a.appointment_date DESC
                `;
            } else if (role === 'doctor') {
                query = `
                    SELECT a.*, u.first_name as patient_first_name, u.last_name as patient_last_name
                    FROM appointments a
                    JOIN users u ON a.patient_id = u.id
                    WHERE a.doctor_id = ?
                    ORDER BY a.appointment_date DESC
                `;
            }

            const [appointments] = await db.query(query, [userId]);
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAvailableSlots: async (req, res) => {
        try {
            const { doctorId, date } = req.query;
            const startTime = new Date(date);
            startTime.setHours(9, 0, 0); // Start at 9 AM
            const endTime = new Date(date);
            endTime.setHours(17, 0, 0); // End at 5 PM

            // Get booked appointments
            const [bookedSlots] = await db.query(
                'SELECT appointment_date FROM appointments WHERE doctor_id = ? AND DATE(appointment_date) = DATE(?)',
                [doctorId, date]
            );

            // Generate available slots (30-minute intervals)
            const availableSlots = [];
            const slotDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
            
            for (let time = startTime.getTime(); time < endTime.getTime(); time += slotDuration) {
                const slotTime = new Date(time);
                const isBooked = bookedSlots.some(slot => 
                    new Date(slot.appointment_date).getTime() === slotTime.getTime()
                );
                
                if (!isBooked) {
                    availableSlots.push(slotTime);
                }
            }

            res.json(availableSlots);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createAppointment: async (req, res) => {
        try {
            const { doctorId, appointmentDate } = req.body;
            const patientId = req.user.id;

            // Check if slot is still available
            const [existingAppointment] = await db.query(
                'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ?',
                [doctorId, appointmentDate]
            );

            if (existingAppointment.length > 0) {
                return res.status(400).json({ message: 'This slot is no longer available' });
            }

            const appointmentId = uuidv4();
            await db.query(
                'INSERT INTO appointments (id, patient_id, doctor_id, appointment_date) VALUES (?, ?, ?, ?)',
                [appointmentId, patientId, doctorId, appointmentDate]
            );

            // Send confirmation emails
            const [doctorInfo] = await db.query(
                'SELECT u.email, u.first_name FROM users u JOIN doctors d ON u.id = d.user_id WHERE d.id = ?',
                [doctorId]
            );

            const [patientInfo] = await db.query(
                'SELECT email, first_name FROM users WHERE id = ?',
                [patientId]
            );

            // Send email to patient
            await sendEmail(
                patientInfo[0].email,
                'Appointment Confirmation',
                `Dear ${patientInfo[0].first_name},\n\nYour appointment with Dr. ${doctorInfo[0].first_name} has been scheduled for ${new Date(appointmentDate).toLocaleString()}.`
            );

            // Send email to doctor
            await sendEmail(
                doctorInfo[0].email,
                'New Appointment Scheduled',
                `Dear Dr. ${doctorInfo[0].first_name},\n\nA new appointment has been scheduled with ${patientInfo[0].first_name} for ${new Date(appointmentDate).toLocaleString()}.`
            );

            res.status(201).json({ message: 'Appointment scheduled successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateAppointment: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            await db.query(
                'UPDATE appointments SET status = ? WHERE id = ?',
                [status, id]
            );

            res.json({ message: 'Appointment updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    cancelAppointment: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query(
                'UPDATE appointments SET status = "cancelled" WHERE id = ?',
                [id]
            );

            res.json({ message: 'Appointment cancelled successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = appointmentController; 