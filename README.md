# 🖼️ AI Image Restoration & Upscaling Platform 🚀

A modern, full-stack **Next.js + TypeScript** application that allows users to **restore old or damaged images** and **upscale images using AI**, with secure authentication and a clean dashboard experience.

This project leverages **Replicate AI models**, **Better Auth**, and a scalable backend to deliver high-quality image enhancement.

---

## ✨ Features

- 🧑‍🎨 **AI Image Restoration**
  - Restore old, blurry, or damaged images
  - Face enhancement & background improvement

- 🔍 **AI Image Upscaling**
  - Increase resolution (2× / 4×)
  - Preserve sharpness and fine details

- 📜 **History System**
  - View restored & upscaled images
  - Download images or copy image URLs

- 🔐 **Secure Authentication**
  - User-based data isolation
  - Protected dashboard routes

- ⚡ **Modern UI**
  - Clean dashboard layout
  - Responsive & fast experience

---

## 🤖 AI Models Used

### 🧠 Image Restoration
**Model:**  
`sczhou/codeformer`

**Purpose**
- Restore old or damaged images
- Enhance faces
- Improve background clarity

**Key Parameters**
- `upscale`
- `face_upsample`
- `background_enhance`
- `codeformer_fidelity`

---

### 🔎 Image Upscaling
**Model:**  
`nightmareai/real-esrgan`

**Purpose**
- Increase image resolution (2× / 4×)
- Preserve sharpness and details
- Suitable for general images

**Key Parameters**
- `scale`
- `face_enhance`

---

## 🛠️ Tech Stack

### 🎨 Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Better Auth (Client)**
- **Lucide Icons**
- **Sonner (Toast Notifications)**

### ⚙️ Backend
- **Next.js API Routes**
- **TypeScript**
- **Replicate SDK**
- **Better Auth (Server)**
- **PostgreSQL (Neon)**
- **Drizzle ORM**

---

## 🔐 Authentication (Better Auth)

Authentication is fully handled using **Better Auth** on both frontend and backend.

### Authentication Features
- Secure sessions
- Protected routes
- Server-side & client-side checks
- User-based data isolation

### 🔒 Protected Routes
- `/dashboard`
- `/dashboard/upload`
- `/dashboard/upscale`
- `/dashboard/history`
- `/dashboard/upscalehistory`

Unauthenticated users are automatically redirected to `/login`.

---

## 📁 Project Structure

```bash
ai-image-restoration-upscaler/
├─ app/
│  ├─ api/
│  │  ├─ restore/
│  │  ├─ upscale/
│  │  └─ auth/
│  ├─ dashboard/
│  │  ├─ upload/
│  │  ├─ upscale/
│  │  ├─ history/
│  │  └─ upscalehistory/
│  ├─ login/
│  └─ register/
│
├─ components/
├─ lib/
├─ db/
├─ public/
├─ README.md
└─ package.json
