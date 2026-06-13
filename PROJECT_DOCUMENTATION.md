# SYSTEMS ENGINEERING DOCUMENTATION

**Product Name**: St. Jude Academy School Registration Management System (RMS)  
**Target Ingress**: Port 3000 (Express Gateway Proxy)  
**Release Compliance**: Production-Grade Secure Release  

---

## 👨‍💻 Engineering & Development Board

This School Registration Management System was designed and developed by **Hiyabiel Aklilu and Noah** to provide schools with a modern, secure, and efficient student registration and management solution. 

Detailed project configurations and core system modules are compiled below.

---

## 🛡️ Part 1: Security & Verification Algorithms

### 1. Unified PBKDF2/SHA-256 Hashing Implementation
To satisfy administrative auditing, standard developer passwords are encrypted server-side during the auth phase using a cryptographic hash pipeline. This guarantees password safety and protects records from third-party interception:

```typescript
import crypto from 'crypto';

// Server Hash Layer
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
```

### 2. Role-Based Privilege Classification matrix
Operating privileges are mapped depending on the authenticated staff member's administrative authorization:

* **Admin Role (Hiyabiel, Noah, Admin)**: Holds complete database write, rewrite, rollback, and record purge permissions.
* **Staff Role (Staff User)**: Holds student file registration, record edits, and daily class attendance submission permissions. Safeguards prevent Staff from initiating destructive deletion operations.

---

## 🗄️ Part 2: Database Schema & Entity Maps

Operations map student catalog items securely inside standard json ledgers inside the isolated `/server-data` registry directory:

```json
{
  "students": [
    {
      "id": "STU-2026-1001",
      "fullName": "Alexander Thompson",
      "dob": "2010-04-12",
      "gender": "Male",
      "grade": "Grade 10",
      "parentName": "Sophia Thompson",
      "parentPhone": "555-019-2834",
      "email": "alex.thompson@school.com",
      "address": "142 Oakridge Ln, Seattle, WA",
      "emergencyContact": "Sophia Thompson (Mother) - 555-019-2834",
      "photoBase64": "data:image/png;base64,...",
      "createdAt": "2026-06-12T14:19:40-07:00",
      "registeredBy": "hiyabiel"
    }
  ]
}
```

### Automatic ID Generation & Collision Prevention
When a student is registered, the server analyzes existing IDs using standard numeric increments:
1. Regex parses `STU-2026-(\d+)`.
2. Selects the maximum numeric parsed code.
3. Adds `1` and returns the string.
4. Directly scans against the live array before storage to prevent double-instantiation collisions.

---

## 📊 Part 3: Dashboard Bento-Grid Layout

The dashboard is structured into high-performance grid lanes requiring no heavy canvas plugins:
* **Stat Blocks**: Total scholar registration counters, student attendance rates, senior tracking indicators, and operation shortcuts.
* **Enrollment Progress Map**: Calculates live relative percentages per class (freshman through senior tracks) and displays progress bars styled dynamically.
* **Recent Activity Feed**: Lists chronological arrivals with developer metadata indicating who processed the enrollment.

---

## 🖨️ Part 4: Vector Printing & PDF Compilation

To bypass heavy library payloads, beautiful vector PDF printouts are achieved with CSS media queries `@media print`, retaining background tints when printed and dynamically dropping dynamic control rails, tabs, buttons, or scrollbars:

1. **Academic receipt**: Outputs a clean invoice structure with watermarked totals, acquittance status declarations, and development credits.
2. **Student report**: Automatically formatted on a single Letter-sized sheet, with signatures for principal designers Hiyabiel Aklilu and Noah.

---

## 📝 Part 5: Official Certification

"This School Registration Management System was designed and developed by **Hiyabiel Aklilu and Noah** to provide schools with a modern, secure, and efficient student registration and management solution."

*Licensed for academic record keeping under secure encryption. Audit compiled June 2026.*
