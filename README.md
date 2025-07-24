# Appookie – Appointment Scheduling Web App 🍪

A playful, modern full-stack appointment scheduling app for friends! Easily request, approve, and track calls, meetings, or chats with real-time notifications and a beautiful UI.

---

## ✨ Features
- **User Registration & Login** (JWT-based, role: User A or User B)
- **Request Appointments** (call, meet, chat, with date/time and notes)
- **Approve, Reject, or Delay** (User B can respond to requests)
- **Email Notifications** (on request and status change)
- **Appointment History & Status** (filter by upcoming, past, pending)
- **Responsive, Playful UI** (Tailwind CSS, pastel gradients, cookie mascot)
- **Real-time Dashboard Updates** (auto-refresh)
- **Protected Routes** (auth guard)

---

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, React Router, Framer Motion, Heroicons
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Nodemailer
- **Other:** React Toastify (toasts), custom event-driven auth state

---

## 🚀 Getting Started

### 1. Clone the repo
```sh
git clone https://github.com/yourusername/appookie.git
cd appookie
```

### 2. Install dependencies
```sh
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configure environment variables
Create a `.env` file in `/backend`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4. Start the app (both frontend & backend)
From the project root:
```sh
start-all.cmd
```
Or run each in separate terminals:
```sh
cd backend && npm run dev
cd frontend && npm run dev
```

### 5. Open in your browser
Visit [http://localhost:5173](http://localhost:5173)

---

## 📸 Screenshots
> _Add your own screenshots here!_
- ![Login Page](screenshots/login.png)
- ![Dashboard](screenshots/dashboard.png)
- ![New Appointment](screenshots/new-appointment.png)

---

## 🧠 Usage
- **Register** as User A (requester) or User B (friend/approver)
- **User A:** Create appointment requests for User B
- **User B:** Approve, reject, or delay requests (with reason)
- **Both:** See all your appointments, filter by status, and get notified by email

---

## 🎨 Customization
- Edit `tailwind.config.js` for colors and gradients
- Replace the 🍪 emoji in the navbar with your own mascot or logo
- Add more animations with Framer Motion

---

## 🤝 Credits
- Built with [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Node.js](https://nodejs.org/), [MongoDB](https://mongodb.com/)
- Inspired by playful productivity tools like [appookie.com](https://appookie.com/)

---

## 📄 License
MIT 