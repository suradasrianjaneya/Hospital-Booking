-- Database schema for Hospital Booking Website
-- PostgreSQL syntax

-- 1. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  available_days VARCHAR(255) NOT NULL
);

-- 2. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  doctor_id INTEGER NOT NULL,
  appointment_date VARCHAR(50) NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS appointment_time VARCHAR(20);

UPDATE appointments
SET appointment_time = COALESCE(appointment_time, '09:00 AM')
WHERE appointment_time IS NULL;

ALTER TABLE appointments
ALTER COLUMN appointment_time SET NOT NULL;

-- Seed Initial Doctors
INSERT INTO doctors (name, specialization, available_days) VALUES 
('Dr. Sarah Jenkins', 'Cardiology', 'Monday, Wednesday, Friday'),
('Dr. Alexander Patel', 'Neurology', 'Tuesday, Thursday'),
('Dr. Emily Vance', 'Pediatrics', 'Monday, Tuesday, Thursday'),
('Dr. Michael Vance', 'Orthopedics', 'Wednesday, Friday'),
('Dr. Helen Brooks', 'General Medicine', 'Monday, Tuesday, Wednesday, Thursday, Friday');
