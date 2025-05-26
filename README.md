# 🎓 OBS Website

**OBS Website** is a student information system (SIS) prototype modeled after a university's online academic portal.  
It allows instructors to add and manage courses, associate them with teachers, and create exams.  
Secure user authentication is implemented via JWT, with role-based access between teachers and students.

---

## 🚀 Features

- 🔐 **JWT Authentication** with role-based user management (Teacher / Student)
- 📚 **Course Management**:
  - Teachers can add and manage courses
  - Courses are listed by teacher
- 📝 **Exam Management**:
  - Teachers can create and assign exams to courses
- 🧑‍🏫 Teacher-student portal access
- 📂 Structured academic data tracking

---

## 🛠️ Tech Stack

| Layer         | Technologies                        |
|---------------|-------------------------------------|
| Server-side   | Node.js, Express.js                 |
| Templating    | EJS (Embedded JavaScript Templates) |
| Frontend      | HTML, CSS                           |
| Authentication| JWT (JSON Web Token)                |
| Database      | Microsoft SQL Server (MSSQL)        |
| Tools         | Git, GitHub, Postman, VS Code       |

---
## 📦 Getting Started

Clone the repository:

```bash
git clone https://github.com/kuyucucaner/OBS-Website.git
cd OBS-Website
npm install

---
## 🛡️ Environment Variables

PORT=5000
DB_SERVERNAME=your_db_servername
DB_NAME=your_db_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_ACCESSECRETKEY:your_jwt_accessecretkey
JWT_REFRESHSECRETKEY:your_jwt_refreshsecretkey
MAIL_ID:your_mail_id
MAIL_PASSWORD:your_mail_password
SESSION_SECRET_KEY:your_session_secret_key
---
## ▶️ Run the App
 npm start

