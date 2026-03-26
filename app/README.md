# Adam Landing v1 - Marketing Site 🚀

**Adam Landing v1** is a high-performance, premium marketing landing page designed to convert and showcase the brand's digital authority.

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite (Next-gen frontend tooling).
- **Language**: TypeScript (Strong typing for maintainability).
- **Styling**: Tailwind CSS + `tailwindcss-animate`.
- **Animations**: GSAP (GreenSock Animation Platform) for smooth, high-end interactions.
- **Icons**: Lucide React.

## 📂 Project Structure

- **[`src/`](./src/)**: Contains the source code.
    - `components/`: Reusable UI components (Buttons, Hero, Sections).
    - `app/`: Application logic and main page assembly.
- **[`public/`](./public/)**: Static assets (Images, Logos, Favicon).
- **[`nginx.conf`](./nginx.conf)**: Production server configuration with caching optimizations.
- **[`Dockerfile`](./Dockerfile)** & **[`captain-definition`](./captain-definition)**: Used for Caprover deployment.

## 🚀 Development & Deployment

### Local Development
1.  Install dependencies: `npm install`
2.  Start dev server: `npm run dev`
3.  Build for production: `npm run build`

### Deployment (Caprover)
The project is configured for automated deployment via Caprover.
- Uses **Nginx** for serving static files.
- **Gzip compression** and **Cache-Control** are pre-configured in `nginx.conf`.
- Deployment is triggered via `captain-definition`.

## ⚡ Performance Optimizations
- **PageSpeed Focus**: Optimized Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).
- **GSAP**: Used for the "Rocket" and "Process" animations to ensure smooth, non-blocking performance.

---
*Professional marketing site documentation by Antigravity AI.*
