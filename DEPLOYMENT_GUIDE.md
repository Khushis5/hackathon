# 🚀 Deployment Guide

Follow these steps to deploy your **Cybersecurity Simulation & Risk Assessment Platform**.

---

## 1. Backend: Deploy to Render
1.  **Push your code to GitHub**: Ensure the `attacksimulator-backend` folder is at the root of your repo or use a monorepo structure.
2.  **Create a New Web Service** on Render.
3.  **Environment Variables**: Add the following in Render Dashboard -> Settings -> Environment:
    - `PORT`: 10000 (Render uses this automatically, but good to have)
    - `FRONTEND_URL`: `https://your-app.vercel.app` (The URL Vercel gives you)
    - `BACKEND_URL`: `https://your-backend.onrender.com` (The URL Render gives you)
    - `JWT_SECRET`: (Random string)
    - `EMAIL_USER`: `attacksimulator.noreply@gmail.com`
    - `EMAIL_APP_PASSWORD`: `qonc nter cupp fasy`
    - `FIREBASE_SERVICE_ACCOUNT`: Copy the entire content of `serviceAccountKey.json` and paste it here as a single string.

---

## 2. Frontend: Deploy to Vercel
1.  **Push your frontend code to GitHub**.
2.  **Import Project in Vercel**.
3.  **Build Settings**:
    - Build Command: `npm run build`
    - Output Directory: `dist`
4.  **Environment Variables**: Add the following in Vercel Dashboard -> Settings -> Environment Variables:
    - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`

---

## 3. Post-Deployment Verification
- Login to your Vercel URL.
- Try creating a campaign.
- Verify that emails are sent with tracking links pointing to `onrender.com`.
- Verify that clicking the link redirects you back to the Vercel app.

> [!TIP]
> **Monorepo Note**: If you have both backend and frontend in one repo, Vercel will ask for the "Root Directory" (usually `./`). On Render, you can set the "Root Directory" to `attacksimulator-backend`.
