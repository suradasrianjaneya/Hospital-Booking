import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')
    ? { rejectUnauthorized: false }
    : false
});

pool.on('error', (err) => {
  console.error('PostgreSQL client pool error:', err.message);
});

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        available_days VARCHAR(255) NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        doctor_id INTEGER NOT NULL,
        appointment_date VARCHAR(50) NOT NULL,
        appointment_time VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      ALTER TABLE appointments
      ADD COLUMN IF NOT EXISTS appointment_time VARCHAR(20)
    `);

    await pool.query(`
      UPDATE appointments
      SET appointment_time = COALESCE(appointment_time, '09:00 AM')
      WHERE appointment_time IS NULL
    `);

    await pool.query(`
      ALTER TABLE appointments
      ALTER COLUMN appointment_time SET NOT NULL
    `);

    const countCheck = await pool.query('SELECT COUNT(*) as count FROM doctors');
    const count = parseInt(countCheck.rows[0].count, 10);

    if (count === 0) {
      console.log('Database empty. Seeding initial doctors data in PostgreSQL...');
      const initialDoctors = [
        ['Dr. Sarah Jenkins', 'Cardiology', 'Monday, Wednesday, Friday'],
        ['Dr. Alexander Patel', 'Neurology', 'Tuesday, Thursday'],
        ['Dr. Emily Vance', 'Pediatrics', 'Monday, Tuesday, Thursday'],
        ['Dr. Michael Vance', 'Orthopedics', 'Wednesday, Friday'],
        ['Dr. Helen Brooks', 'General Medicine', 'Monday, Tuesday, Wednesday, Thursday, Friday']
      ];

      for (const doc of initialDoctors) {
        await pool.query(
          'INSERT INTO doctors (name, specialization, available_days) VALUES ($1, $2, $3)',
          doc
        );
      }
      console.log('Seeding initial doctors completed in PostgreSQL.');
    }
  } catch (err) {
    console.error('Error initializing PostgreSQL database:', err.message);
  }
}

// Database helper actions
export const query = async (sql, params = []) => {
  const res = await pool.query(sql, params);
  return res.rows;
};

export const get = async (sql, params = []) => {
  const res = await pool.query(sql, params);
  return res.rows[0];
};

export const run = async (sql, params = []) => {
  const res = await pool.query(sql, params);
  return {
    id: res.rows[0]?.id || null,
    changes: res.rowCount
  };
};

// Initialize
initializeDatabase();

try {
  const result = await pool.query('SELECT NOW()');
  console.log('Connected to PostgreSQL');
  console.log(result.rows[0]);
} catch (err) {
  console.error(err);
}

export default pool;
