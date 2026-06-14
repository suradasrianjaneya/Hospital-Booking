import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, get, run } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const isValidDateString = (value) => {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend production build
app.use(express.static(path.join(__dirname, 'dist')));

// --- API ROUTES ---

// 1. Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'mock-jwt-token-admin', message: 'Logged in successfully' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// 2. Fetch all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await query('SELECT * FROM doctors ORDER BY name ASC');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve doctors', details: error.message });
  }
});

// 3. Fetch available slots for a doctor on a specific date
app.get('/api/doctors/:id/available-slots', async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  if (!isValidDateString(date)) {
    return res.status(400).json({ error: 'Please provide a valid appointment date in YYYY-MM-DD format' });
  }

  try {
    const doctor = await get('SELECT id FROM doctors WHERE id = $1', [id]);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const bookedAppointments = await query(
      'SELECT appointment_time FROM appointments WHERE doctor_id = $1 AND appointment_date = $2',
      [id, date]
    );

    const bookedSlots = new Set(bookedAppointments.map((appointment) => appointment.appointment_time));
    const availableSlots = DEFAULT_SLOTS.filter((slot) => !bookedSlots.has(slot));

    res.json({
      doctorId: Number(id),
      date,
      availableSlots
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve available slots', details: error.message });
  }
});

// 4. Create a doctor (Admin)
app.post('/api/doctors', async (req, res) => {
  const { name, specialization, available_days } = req.body;
  if (!name || !specialization || !available_days) {
    return res.status(400).json({ error: 'All fields (name, specialization, available_days) are required' });
  }
  try {
    const result = await run(
      'INSERT INTO doctors (name, specialization, available_days) VALUES ($1, $2, $3) RETURNING id',
      [name, specialization, available_days]
    );
    res.status(201).json({ id: result.id, name, specialization, available_days });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create doctor', details: error.message });
  }
});

// 5. Edit a doctor (Admin)
app.put('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, specialization, available_days } = req.body;
  if (!name || !specialization || !available_days) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const result = await run(
      'UPDATE doctors SET name = $1, specialization = $2, available_days = $3 WHERE id = $4',
      [name, specialization, available_days, id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ id, name, specialization, available_days });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update doctor', details: error.message });
  }
});

// 6. Delete a doctor (Admin)
app.delete('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await run('DELETE FROM doctors WHERE id = $1', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete doctor', details: error.message });
  }
});

// 7. View all appointments (Admin)
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await query(`
      SELECT a.*, d.name as doctor_name, d.specialization as doctor_specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date ASC, a.appointment_time ASC, a.created_at DESC
    `);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments', details: error.message });
  }
});

// 8. Book a new appointment
app.post('/api/appointments', async (req, res) => {
  const { patient_name, phone, email, doctor_id, appointment_date, appointment_time, message } = req.body;

  if (!patient_name || !patient_name.trim()) {
    return res.status(400).json({ error: 'Patient name is required' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required' });
  }
  if (!doctor_id) {
    return res.status(400).json({ error: 'Doctor selection is required' });
  }
  if (!appointment_date) {
    return res.status(400).json({ error: 'Appointment date is required' });
  }
  if (!appointment_time || !appointment_time.trim()) {
    return res.status(400).json({ error: 'Appointment time is required' });
  }

  if (!isValidDateString(appointment_date)) {
    return res.status(400).json({ error: 'Please provide a valid appointment date in YYYY-MM-DD format' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  try {
    const doctor = await get('SELECT id, name, specialization FROM doctors WHERE id = $1', [doctor_id]);
    if (!doctor) {
      return res.status(404).json({ error: 'Selected doctor does not exist' });
    }

    const existingAppointment = await get(
      'SELECT id FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3',
      [doctor_id, appointment_date, appointment_time]
    );

    if (existingAppointment) {
      return res.status(409).json({ error: 'Selected time slot is already booked' });
    }

    const result = await run(
      `INSERT INTO appointments (patient_name, phone, email, doctor_id, appointment_date, appointment_time, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [patient_name, phone, email, doctor_id, appointment_date, appointment_time, message || '']
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointmentId: result.id,
      doctorName: doctor.name,
      appointmentDate: appointment_date,
      appointmentTime: appointment_time
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
});

// 9. Delete / Cancel an appointment (Admin)
app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await run('DELETE FROM appointments WHERE id = $1', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment', details: error.message });
  }
});

// For any other request, return React's index.html (supports SPA routes in production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
