![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Deployed](https://img.shields.io/badge/Live-Demo-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

# Quiz App
A full-stack quiz application built with React, Node.js, Express, and MongoDB. Features include user authentication, quiz creation and participation, leaderboard tracking, responsive UI, and image upload with Cloudinary. Designed for scalable deployment on Render.

## 🚀 Features

### 👤 Authentication
- User Sign Up / Login with OTP verification
- Forgot Password support
- Modal-based UI with global AuthContext

### 📝 Quiz Creation
- Create quizzes with multiple slides (questions)
- Add options and correct answers
- Optionally upload images via Cloudinary

### 🎮 Quiz Playing
- Smooth, slide-based UI
- Timed quiz attempts (optional)
- Instant score calculation on submission

### 🏆 Leaderboard
- Shows top scores per quiz
- Displays only the best score per user
- Updated in real-time after each submission

### 🧰 User Dashboard
- View all quizzes created by the user
- Delete own quizzes
- “My Quizzes” and “Attempted Quizzes” section

### 📱 Responsive Design
- Fully responsive with mobile-friendly hamburger menu
- Category icons and navigation optimized for all screen sizes

---
## 🖼️ Demo Preview

![Quiz App Demo](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXc2bHA0ZnBvenRhdmlyMWZ5N2RwOGdoYXQ1OHA4NmJud3B1M2JwcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bXQY4nMnQhK2HpEbvj/giphy.gif)

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React (Vite)
- React Bootstrap + Font Awesome
- Axios, Context API (for Auth & Modal management)

### 🔹 Backend
- Node.js + Express
- MongoDB + Mongoose
- Cloudinary (for image uploads)
- Nodemailer (for OTP verification)

---

## 🧑‍💻 Project Structure

```txt
/project-root
│
├── /client # React frontend (npm start)
│ └── src/
│ └── components, context, pages, assets, etc.
│
├── /server # Node.js backend (node index.js)
│ └── controllers, models, routes, utils
│
└── README.md
```

---

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Architl/quiz-app.git
cd quiz-app
```
### 2. Setup the backend

```bash
cd server
npm install
```

Create a .env file inside server/:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Start the backend:

```bash
node index.js
```

### 3. Setup the frontend

```bash
cd ../client
npm install
npm start
```

## 🌐 Live Demo

https://quiz-app-client-ediq.onrender.com/

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

- [@architlalwani](https://github.com/Architl)

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to open an issue or submit a pull request.
