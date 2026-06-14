# MedThreads Hospital Booking Website

MedThreads Hospital is a modern, premium web application built for clinical care scheduling. The project integrates high-fidelity visual aesthetics using WebGL threads, an administrative dashboard with doctor CRUD operations, a patient appointment scheduling wizard, and SQLite database storage.

## Features

### 🌟 Patient Portal (Frontend SPA)
* **Home Page**: Dynamic WebGL-based visual header leveraging the `<Threads />` component, interactive services catalog (Cardiology, Neurology, Pediatrics, Orthopedics, General Medicine), and hospital highlights.
* **Doctors Directory**: Real-time listing of clinical practitioners fetched directly from the database with specialty filters. Pre-booking actions route directly to the scheduling form.
* **Appointment Booking Wizard**: Robust form validation (names, emails, phone numbers, date controls). Dynamic scheduler advisor displaying active hours based on the selected doctor. Confirmation summary modal upon successful submission.
* **Contact Center**: Operational hours, locator address, phone directories, and direct clinic inquiry submission forms.

### 🛡️ Admin Management Portal
* **Protected Authorization Entry**: Secure administrative login form (`admin` / `admin123`).
* **Visual Dashboard Summary**: Dynamic stat counts showing total doctor registrations and booking requests in real time.
* **Doctors CRUD Directory Manager**: Administrative capacity to add new doctors, modify clinical specialties/consulting hours, and delete retired records.
* **Appointments Registry**: Tabular log showing all patient bookings, phone numbers, emails, health issues descriptions, and cancellation triggers.

---

## Technology Stack

* **Frontend**: React 19 (JavaScript), Vite 8, Lucide React (vector iconography), Custom CSS (Obsidian glassmorphism layout theme).
* **WebGL Graphics**: OGL (minimalist WebGL library by Google Creative Lab) powering the `<Threads />` component.
* **Backend**: Node.js, Express, Cors.
* **Database Engine**: SQLite 3 (stored locally in `hospital.db`).
* **Dev Tools**: Concurrently, Nodemon.

---

## Database Architecture

The SQLite engine initializes the database inside `hospital.db`. Two primary relational structures are established:

### 1. `doctors` Table
* `id` (INTEGER, Primary Key Autoincrement)
* `name` (TEXT, Not Null)
* `specialization` (TEXT, Not Null)
* `available_days` (TEXT, Not Null)

### 2. `appointments` Table
* `id` (INTEGER, Primary Key Autoincrement)
* `patient_name` (TEXT, Not Null)
* `phone` (TEXT, Not Null)
* `email` (TEXT, Not Null)
* `doctor_id` (INTEGER, Foreign Key referencing `doctors(id)` ON DELETE CASCADE)
* `appointment_date` (TEXT, Not Null)
* `message` (TEXT)
* `created_at` (DATETIME, default current timestamp)

*Note: Initial records are seeded automatically upon server startup if database fields are blank.*

---

## Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
* NPM (v8.0 or higher)

### Installation Steps

1. **Clone or Open Project Directory**:
   Ensure you are in the project root folder:
   ```bash
   cd "Hospital Booking"
   ```

2. **Install Package Dependencies**:
   Install all node packages for backend, frontend, and build tools:
   ```bash
   npm install
   ```

3. **Start Development Environment**:
   Run both the Express server API and Vite dev server simultaneously:
   ```bash
   npm run dev
   ```
   * The frontend application will load at: `http://localhost:5173`
   * The API server will run at: `http://localhost:5000`
   * Backend endpoints route through the Vite server proxy dynamically.

4. **Access the Admin Portal**:
   * Username: `admin`
   * Password: `admin123`

5. **Build for Production**:
   Compile the bundle files for production server serving:
   ```bash
   npm run build
   ```
   To run the production bundle locally:
   ```bash
   npm run server
   ```
   Open `http://localhost:5000` to browse the compiled application.
