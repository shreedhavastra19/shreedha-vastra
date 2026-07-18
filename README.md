# Shreedha Vastra 👑

**Premium Indian Ethnic Wear — E-Commerce Platform**

A full-stack, production-ready e-commerce website for a luxury Indian ethnic clothing brand — built completely from scratch (no website builders, no templates).

---

## ✨ Brand

- **Name:** Shreedha Vastra
- **Style:** Premium, royal, elegant, traditional Indian, luxury ethnic wear, modern shopping experience
- **Colors:** Peach, Light Pink, Royal Gold, Ivory, White, Beige
- **Typography:** Elegant serif (headings) + clean modern sans-serif (body)

---

## 🛠️ Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| Frontend       | React (Vite) + Tailwind CSS + JavaScript ES6+    |
| Backend        | Node.js + Express                                |
| Database       | MongoDB + Mongoose                               |
| Auth           | JWT (httpOnly cookies) + bcrypt password hashing |
| Payments       | Razorpay (UPI, Cards, Net Banking, COD)          |
| Image Storage  | Cloudinary (production) / local disk (dev)       |
| Deployment     | Frontend → Vercel · Backend → Render/Railway     |

---

## 📁 Project Structure

```
shreedha-vastra/
├── backend/         Node.js + Express + MongoDB API
├── frontend/         React (Vite) + Tailwind customer & admin UI
├── docs/             Setup & deployment guides
├── .gitignore
└── README.md
```

Full folder breakdown for each app lives inside `backend/README.md` and `frontend/README.md` (created when we scaffold those apps).

---

## 🚀 Getting Started (Local Development)

> ⚠️ These steps will become fully actionable once the backend and frontend are scaffolded. Placeholder for now — will be updated as we build.

### Prerequisites
- Node.js v18+ and npm installed
- A MongoDB database (local install OR free MongoDB Atlas cluster)
- A Razorpay account (test mode keys are free)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd shreedha-vastra

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` in both `backend/` and `frontend/`, and fill in your own values (MongoDB URI, JWT secret, Razorpay keys, etc.).

### 3. Run in Development
```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

---

## 📦 Core Features

- Customer storefront: homepage, categories, product pages, cart, wishlist, checkout
- User accounts: signup, login, forgot password, profile, address book, order history
- Admin dashboard: products, inventory, orders, customers, coupons, banners, analytics
- Secure payments via Razorpay (UPI / Cards / Net Banking / COD)
- Shipping: delivery tracking, estimated delivery, shipping charge calculation
- SEO-optimized, fast-loading, mobile-first responsive design

---

## 📖 Documentation

Additional guides (added as the project progresses):
- `docs/deployment.md` — how to deploy backend, frontend, and connect the `shreedhavastra.in` domain
- `docs/environment-variables.md` — full list of required env vars and where to get them

---

## 📝 License & Ownership

Proprietary — All rights reserved by Shreedha Vastra.

---

## 🧭 Build Status

This project is being built incrementally, file by file. See commit history / build log for progress.
