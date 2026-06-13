import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('PostgreSQL client pool error:', err.message);
});

async function initializeDatabase() {
  try {
    // Create Doctors Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        available_days VARCHAR(255) NOT NULL
      )
    `);

    // Create Appointments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        doctor_id INTEGER NOT NULL,
        appointment_date VARCHAR(50) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    // Seed doctors if none exist
    const countCheck = await pool.query('SELECT COUNT(*) as count FROM doctors');
    const count = parseInt(countCheck.rows[0].count, 10);
    
    if (count === 0) {
      console.log("Database empty. Seeding initial doctors data in PostgreSQL...");
      const initialDoctors = [
        ["Dr. Sarah Jenkins", "Cardiology", "Monday, Wednesday, Friday"],
        ["Dr. Alexander Patel", "Neurology", "Tuesday, Thursday"],
        ["Dr. Emily Vance", "Pediatrics", "Monday, Tuesday, Thursday"],
        ["Dr. Michael Vance", "Orthopedics", "Wednesday, Friday"],
        ["Dr. Helen Brooks", "General Medicine", "Monday, Tuesday, Wednesday, Thursday, Friday"]
      ];
      
      for (const doc of initialDoctors) {
        await pool.query(
          "INSERT INTO doctors (name, specialization, available_days) VALUES ($1, $2, $3)",
          doc
        );
      }
      console.log("Seeding initial doctors completed in PostgreSQL.");
    }
  } catch (err) {
    console.error("Error initializing PostgreSQL database:", err.message);
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

export default pool;
