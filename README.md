# 🎓 Student Management System

A **Student Management System** developed using **Bash Shell Scripting** with a simple **GUI interface**. The application provides role-based access for **Administrators**, **Teachers**, and **Students**, enabling efficient management of courses, enrollments, attendance, and grades. All data is stored and managed using CSV files, making the project lightweight and easy to maintain.

---

## 📖 Overview

This project demonstrates how Bash scripting can be used to build a complete management system with authentication, data persistence, and a user-friendly interface.

It is designed as an academic project to showcase scripting, file handling, and role-based access control.

---

## ✨ Features

### 👨‍💼 Administrator
- Create and manage teachers
- Create and manage students
- Create and manage courses
- Create and manage semesters
- Enroll students in courses
- Assign or update course instructors
- Delete student records
- View all available records

### 👩‍🏫 Teacher
- Secure login authentication
- View assigned courses
- View enrolled students
- Update attendance
- Enter quiz marks
- Enter mid-term marks
- Enter final examination marks
- Automatically maintain student records

### 👨‍🎓 Student
- Secure login authentication
- View enrolled courses
- Check attendance records
- View quiz marks
- View mid-term marks
- View final examination marks
- View overall grades

---

## 🛠️ Technologies Used

- **Bash Shell Scripting**
- **Linux Shell**
- **CSV File Storage**
- **GUI Components**
- **File Handling**
- **Role-Based Authentication**

---

## 📂 Project Structure

```text
Student-Management-System/
│
├── sms.sh                 # Main application
├── GUI/                   # GUI components
├── data/                  # CSV database files
├── sample_data/           # Sample datasets
├── README.md              # Documentation
├── .gitignore
└── package files (if applicable)
```

---

## 🚀 Getting Started

### Prerequisites

- Linux / WSL / Git Bash
- Bash Shell
- GUI dependencies (if required)

### Clone the Repository

```bash
git clone https://github.com/Yougeshkumar/Student-Management-System.git
```

### Navigate to the Project

```bash
cd Student-Management-System
```

### Make the Script Executable

```bash
chmod +x sms.sh
```

### Run the Project

```bash
./sms.sh
```

---

## 🔐 User Roles

| Role | Permissions |
|-------|-------------|
| Admin | Full system management |
| Teacher | Manage student academic records |
| Student | View academic information |

---

## 💾 Data Storage

The system stores all information using **CSV files**, including:

- Student Records
- Teacher Records
- Course Information
- Semester Details
- Enrollment Records
- Attendance
- Marks and Grades

---

## 📸 Screenshots

You can add screenshots here.

```text
screenshots/
├── login.png
├── admin-dashboard.png
├── teacher-dashboard.png
└── student-dashboard.png
```

---

## 📈 Future Improvements

- MySQL database integration
- Web-based dashboard
- Student profile management
- Email notifications
- Report generation
- PDF result cards
- Advanced GUI
- Cloud deployment

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Yougesh Kumar**

- 📧 Email: yougeshkumar8809@gmail.com
- 💼 LinkedIn: https://linkedin.com/in/yougeshkumar22
- 💻 GitHub: https://github.com/Yougeshkumar

---

## 📄 License

This project is developed for **educational and learning purposes**.

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub!
