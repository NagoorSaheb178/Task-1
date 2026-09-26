# 🎓 Vidya Kendra — Assignment & Management Dashboard

A modern, highly-responsive, and premium React.js dashboard designed for educational institutions. It features seamless role-based views for **Students** and **Faculty (Admins)**, complete with Lottie-like micro-animations and beautiful real-time analytics.

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd join

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in your browser at http://localhost:5173
```

---

## ✨ Premium Features & Design

1. **Role-Based Workflows**: Instantly switch between Student and Faculty views using the Header toggle. Each role provides a highly tailored experience—students track their personal progress, while faculty get a birds-eye view of class analytics.
2. **Dynamic Live Analytics**: The Faculty Dashboard features beautifully styled, real-time "Submission Trends" bar charts and "Grade Distribution" donut charts that dynamically calculate from underlying course data.
3. **Lottie-style Micro-animations**: The sidebar and interactive elements feature custom Tailwind keyframes (jelly, wiggle, bounce, pop) that make the UI feel alive and highly polished without relying on heavy external animation libraries.
4. **Data Persistence**: All state (assignments, submissions, current role) is persisted locally via a custom `useLocalStorage` context hook. No backend required to test!
5. **Double-Verification Submission**: Students submit assignments through a secure, 3-step modal flow ensuring data integrity and exact timestamping.
6. **Fully Responsive**: Flawless layout adapting across mobile, tablet, and desktop viewports with horizontal scrolling tables and perfectly stacking grid components.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── admin/              # Faculty-specific views (Assignment Roster, Drawer)
│   ├── layout/             # Shell components (Header, Sidebar)
│   ├── shared/             # Reusable UI (ProgressBars, Badges, Toasts)
│   └── student/            # Student-specific views (Progress Cards, Submissions)
├── context/
│   └── AppContext.jsx      # Global state and mock data manager
├── data/
│   └── mockData.js         # Simulated backend database (Courses, Students, Assignments)
├── pages/
│   ├── AdminDashboard.jsx  # Faculty Dashboard & Analytics
│   └── StudentDashboard.jsx # Student Tracking & Assignments
└── App.jsx                 # Main layout routing
```

---

## 🛠️ Technology Stack

- **React 18** — Core UI framework
- **Vite 5** — Next-generation frontend tooling
- **Tailwind CSS 3** — Utility-first styling with custom animation keyframes
- **Lucide React** — Beautiful, consistent SVG iconography
- **React Router DOM 6** — Client-side routing

---

## 📱 Mobile Responsiveness

The application was built to be responsive at all breakpoints:
- **Desktop (≥1024px)**: Expanded sidebar, full analytics grid, and complete data tables.
- **Tablet (768–1023px)**: Reflowing bento-grids, condensed typography.
- **Mobile (<768px)**: Hidden sidebar with hamburger toggle, vertically stacked forms and charts, and horizontally scrollable data tables.

---

## 📝 License

Developed as part of the Joineazy Frontend Intern assignment. Focuses on premium aesthetics, clean code architecture, and flawless UX.
