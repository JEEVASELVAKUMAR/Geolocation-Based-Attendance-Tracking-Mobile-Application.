# Smart Geolocation Attendance System

A production-ready geolocation-based attendance tracking system with geofencing, timing rules, and a magical UI/UX.

## Features
- **Professional UI/UX**: High-end Dark/Blue professional aesthetic with glassmorphism and smooth animations.
- **Geofencing**: Employees can only mark attendance within the configured organization radius (GPS verified).
- **Staff Self-Registration**: Secure signup flow with password confirmation and input validation.
- **Password Recovery**: Integrated "Forgot Password" portal for secure account recovery.
- **Advanced Reporting**: 
    - **Monthly Logs**: Beautifully formatted attendance history for both Admins and Employees.
    - **Excel Export**: One-click master sheet download for administrators.
- **Automatic Systems**:
    - **Proactive Detection**: Suggestions to check-in when entering the geofence.
    - **Auto-Checkout**: Automated end-of-day session closing (11:59 PM).
- **Timing Rules**: Mandatory late reasons after 09:15 AM and early leave reasons before 04:40 PM.

## Prerequisites
- **Node.js**: v14 or higher
- **MongoDB**: Local or Atlas instance

## Setup Instructions

### 1. Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the admin account:
   ```bash
   node seed.js
   ```
   - **Default Admin Email**: `admin@system.com`
   - **Default Admin Password**: `adminpassword123`
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal in the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Flow
1. **Login** as Admin (`admin@system.com`).
2. **Config Org**: Go to "Org Config" and set your Org Name and Coordinates (Latitude/Longitude).
3. **Register Employee**: Use "Employee Management" to add staff (paste the Org ID from the config list).
4. **Attendance**: Login as an employee to mark attendance on the Dashboard.

---
**Developed using GIS Technology – VSB Engineering College**  
*Created with ❤️ by JEEVA S*
