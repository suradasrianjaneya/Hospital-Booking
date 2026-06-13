import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, get, run } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

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

// 3. Create a doctor (Admin)
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

// 4. Edit a doctor (Admin)
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
      return res.status(444).json({ error: 'Doctor not found' });
    }
    res.json({ id, name, specialization, available_days });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update doctor', details: error.message });
  }
});

// 5. Delete a doctor (Admin)
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

// 6. View all appointments (Admin)
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await query(`
      SELECT a.*, d.name as doctor_name, d.specialization as doctor_specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date ASC, a.created_at DESC
    `);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments', details: error.message });
  }
});

// 7. Book a new appointment
app.post('/api/appointments', async (req, res) => {
  const { patient_name, phone, email, doctor_id, appointment_date, message } = req.body;
  
  // Basic validation
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

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  try {
    // Confirm doctor exists
    const doctor = await get('SELECT id FROM doctors WHERE id = $1', [doctor_id]);
    if (!doctor) {
      return res.status(400).json({ error: 'Selected doctor does not exist' });
    }

    const result = await run(
      `INSERT INTO appointments (patient_name, phone, email, doctor_id, appointment_date, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [patient_name, phone, email, doctor_id, appointment_date, message || '']
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointmentId: result.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
});

// 8. Delete / Cancel an appointment (Admin)
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
