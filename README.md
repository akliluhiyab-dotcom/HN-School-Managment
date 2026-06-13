# SCHOOL REGISTRATION MANAGEMENT SYSTEM (RMS)

An executive, high-fidelity administrative portal engineered to maintain scholar registers, student credentials, attendance loggingheets, and financial matriculation vouchers of St. Jude Academy.

Designed, developed, and certified for official deployment by:
* **Hiyabiel Aklilu**
* **Noah**

---

## 🛠️ System Architecture

Built on a robust full-stack foundation to bypass transience restrictions and handle active operations securely:

```
[ CLIENT DIRECTORY (React 19 + Tailwind v4 + Lucide) ]
                      │
                      ▼ (Restful JSON Queries over Port 3000)
[ SERVER CONTROLLER (Express Node + tsx Execution) ]
                      │
                      ▼
[ RECTOR SECURITY (SHA-256 PBKDF2 Password Hashing) ]
                      │
                      ▼
[ FILE DATABASE STORAGE (server-data/ students & attendance logs) ]
```

---

## 📁 Project Directory Structure

```
/
├── .env.example               # Template documenting environmental keys and secret flags
├── .gitignore                 # Excludes logs, runtime assets, node_modules from repository
├── index.html                 # Main SPA viewport mount header
├── metadata.json              # Applet descriptor details and credentials authority
├── package.json               # Modular Node dependency catalog and build command scripts
├── server.ts                  # Backend Express server with server-side database files
├── tsconfig.json              # Strict TypeScript compilation ruleset configuration
├── vite.config.ts             # Direct SPA configurations and path-alias bindings
├── server-data/               # SECURE STORAGE DATABASE DIRECTORY
│   ├── students.json          # Persistent Student ledger data (JSON file database)
│   └── attendance.json        # Persistent Attendance log ledger sheets
└── src/                       # FRONT-END CLIENT CODES
    ├── types.ts               # Shared global TypeScript definitions
    ├── main.tsx               # Primary React DOM bootstrap mounting
    ├── index.css              # Custom print styles and Google typography pairings
    ├── App.tsx                # Context holder and App controller router with dark toggling
    └── components/            # REUSABLE FRONTEND MODULE GRAPHICS
        ├── LoginView.tsx      # Secure custom hashed authentication card
        ├── Dashboard.tsx      # Bento-grid dashboard, grade counts & operations center
        ├── StudentForm.tsx    # Scroll form validating inputs with drop-file Base64 photo conversions
        ├── StudentDirectory.tsx # Admin query table, CSV exporter, receipt print, dossier print
        ├── AboutView.tsx      # Dedicated product overview and developers' profile
        └── AttendanceTracker.tsx # Daily calendar attendance marking sheet
```

---

## 💾 Core Databases & Schemas

The system handles data representation natively in two files under the `server-data/` folder:

### 1. Scholars Schema (`server-data/students.json`)
```typescript
interface Student {
  id: string;              // Auto-generated ID, pattern STU-2026-XXXX
  fullName: string;        // Scholar full legal name
  dob: string;             // Date of Birth (YYYY-MM-DD)
  gender: 'Male'|'Female'|'Other'; 
  grade: string;           // E.g., Grade 9, Grade 10, Grade 11, Grade 12
  parentName: string;      // Full name of primary guardian
  parentPhone: string;     // Guardian contact phone index
  email: string;           // Billing standard academic email
  address: string;         // Residential physical coordinate
  emergencyContact: string; // Safety name and fallback contact details
  photoBase64?: string;    // Base64-converted high-contrast file string
  createdAt: string;       // Registration Timestamp
  registeredBy: string;    // Action username tracking
}
```

### 2. Daily Attendance Schema (`server-data/attendance.json`)
```typescript
interface AttendanceSheet {
  date: string;            // Journal Entry Date (YYYY-MM-DD)
  records: Array<{
    studentId: string;
    status: 'Present' | 'Absent' | 'Late';
    remarks?: string;
  }>;
  submittedBy: string;     // Registrar author
  submittedAt: string;     // ISO Timestamp
}
```

---

## 🚀 Installation & Local Execution

To spin up this production-certified full-stack system locally:

### Prerequisites
- Node.js (v20 or higher recommended)
- npm package manager

### Steps
1. **Clone project assets** and navigate into the root directory:
   ```bash
   cd school-registration-system
   ```
2. **Install modular dependencies** defined in manifest:
   ```bash
   npm install
   ```
3. **Configure the environment profile**:
   ```bash
   cp .env.example .env
   ```
4. **Boot the complete application** in Development mode:
   ```bash
   npm run dev
   ```
   *The Express controller launches, boots Vite dev middleware, and maps ingress bindings to local port 3000 (accessible on http://localhost:3000).*

5. **Compile for Production deployment**:
   ```bash
   npm run build
   ```
   *Compiles static front-end assets to `/dist` and bundles `server.ts` into a standalone CommonJS execution file (`dist/server.cjs`) using esbuild.*

6. **Start Compiled Production Server**:
   ```bash
   npm run start
   ```

---

## 🔐 Administrative Account Logins

To log in and navigate privileges within the administrative system, utilize these SHA-256 verified review profiles:

| Username | Decrypted Password | Authorized System Role | Privilege Capability |
| :--- | :--- | :--- | :--- |
| **hiyabiel** | `hiyabiel2026` | Admin Manager | All actions (including records deletions) |
| **noah** | `noah2026` | Admin Manager | All actions (including records deletions) |
| **admin** | `admin123` | Admin User | All actions (including records deletions) |
| **staff** | `staff123` | Registry Staff | Register/Update/Attend stats (cannot delete) |

---

## 📄 Developers Certification

"This School Registration Management System was designed and developed by **Hiyabiel Aklilu and Noah** to provide schools with a modern, secure, and efficient student registration and management solution."
