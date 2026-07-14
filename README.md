# ShebaBD - Premium Doctor Appointment & Telemedicine System (Client)

A responsive, high-performance web client interface for **ShebaBD Doctor Appointment System** built using React, Vite, TypeScript, and Tailwind CSS. 

---

## 🔗 Live Deployment & Repository Links
* **Live Website**: [https://sheba-bd-frontend-rho.vercel.app](https://sheba-bd-frontend-rho.vercel.app)
* **GitHub Repository**: [https://github.com/Saad7528/Sheba_bd_frontend](https://github.com/Saad7528/Sheba_bd_frontend)

---

## ✨ Features
1. **Google OAuth 2.0 Integration**: One-click Google sign-in/registration for patients.
2. **Role-Based Access Control (RBAC)**:
   - **Patients**: Browse doctor directories, search by name/specialty/location, book chamber appointments, and download digital prescriptions.
   - **Doctors**: Manage their own doctor profiles (edit only), approve/cancel booking requests, track their patient medical history logs, and write digital prescriptions.
   - **Administrators**: Create, edit, and delete doctor profiles, view full site appointments analytics, and access all dashboard metrics.
3. **"My Patients" Medical Directory**: Allows logged-in doctors to see a consolidated timeline of all treated patients and their past consult notes.
4. **Digital Prescription Generator (PDF)**: Allows doctors to issue digital prescriptions and lets patients download them directly from their dashboard in a clean, professional medical pad layout.
5. **Dashboard Analytics**: Displays daily/weekly consultation charts powered by **Recharts**.
6. **Vite SPA Routing Rewrite**: Implemented `vercel.json` rules to resolve direct navigation 404 issues on Vercel deployments.

---

## 🔑 Demo Login Credentials
All demo accounts share the same default password:

* **Patient Account (User)**:
  * **Email**: `patient@healthbd.com`
  * **Password**: `password123`
* **Doctor Account (Doctor)**:
  * **Email**: `doctor@healthbd.com`
  * **Password**: `password123`
* **Admin Account (Admin)**:
  * **Email**: `admin@healthbd.com`
  * **Password**: `password123`

---

## 🛠️ Installation & Local Setup

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **NPM** or **Yarn**

### 2. Setup Steps
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/Saad7528/Sheba_bd_frontend.git
   cd Sheba_bd_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The client will be running locally at [http://localhost:5173](http://localhost:5173).*

---

## 💻 Tech Stack
* **Framework**: React (v18)
* **Build Tool**: Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS & Vanilla CSS
* **Icons**: Lucide React
* **Charts**: Recharts

---

## 📄 License
Licensed under the [MIT License](LICENSE).
