CREATE DATABASE telemedicine_db;

USE telemedicine_db;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('patient', 'doctor', 'admin') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE specialties (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE hospitals (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    type ENUM('primary', 'secondary', 'tertiary') NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255)
);

CREATE TABLE doctors (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    specialty_id VARCHAR(36) REFERENCES specialties(id),
    hospital_id VARCHAR(36) REFERENCES hospitals(id),
    license_number VARCHAR(50) NOT NULL,
    years_of_experience INT
);

CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES users(id),
    doctor_id VARCHAR(36) REFERENCES doctors(id),
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    meeting_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo data for specialties
INSERT INTO specialties (id, name, description) VALUES
('1', 'General Practice', 'Primary healthcare services'),
('2', 'Pediatrics', 'Child healthcare'),
('3', 'Obstetrics & Gynecology', 'Women''s health'),
('4', 'Cardiology', 'Heart-related conditions'),
('5', 'Orthopedics', 'Bone and joint care');

-- Insert demo data for hospitals in Nigeria
INSERT INTO hospitals (id, name, address, city, state, type, phone, email) VALUES
('1', 'Lagos University Teaching Hospital', 'Idi-Araba', 'Lagos', 'Lagos', 'tertiary', '+234-1-234-5678', 'info@luth.edu.ng'),
('2', 'University College Hospital', 'Queen Elizabeth Road', 'Ibadan', 'Oyo', 'tertiary', '+234-2-234-5678', 'info@uch-ibadan.org.ng'),
('3', 'National Hospital Abuja', 'Plot 132 Central District', 'Abuja', 'FCT', 'tertiary', '+234-9-234-5678', 'info@nationalhospital.gov.ng'); 