# shadow.io 影

An immersive, high-fidelity interactive web application showcasing next-generation AR sports. Experience hardware-free gesture tracking for virtual sports including Cricket, Table Tennis, Football, and Shadowboxing. Built with React, TypeScript, Vite, and TailwindCSS, featuring dynamic HTML5 canvas lightning and particle physics.

## 🚀 Quick Start

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) installed.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shadow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

This will spin up the Vite development server. Open the link displayed in your terminal (typically [http://localhost:5173/](http://localhost:5173/)) to view the site locally.

### 4. Build for Production

To compile and optimize the site for production:

```bash
npm run build
```

This checks types with TypeScript (`tsc`) and compiles static assets using Vite to the `dist/` directory.

### 5. Preview Production Build

To preview the compiled site locally before deploying:

```bash
npm run preview
```

### 6. Deploy to GitHub Pages

To deploy the latest build directly to GitHub Pages:

```bash
npm run deploy
```

---

## 🛠️ Tech Stack & Features

- **Frontend Core:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vite.dev/) (blazing fast bundling and Hot Module Replacement)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) & [Lucide React Icons](https://lucide.dev/)
- **Graphics & Effects:** High-performance custom HTML5 Canvas rendering for dynamic lightning veins, branches, screenshakes, and particle physics bursts.
- **Audio Experience:** Fully responsive interactive audio controller for background music track loop and ambient sound controls.

---

## 📂 Project Structure

```
shadow/
├── public/                 # Static assets (audio tracks, images, etc.)
├── src/
│   ├── assets/             # Component-specific design assets
│   ├── App.tsx             # Main React entry point containing application layout and states
│   ├── index.css           # Global Tailwind and custom style utilities
│   └── main.tsx            # React DOM mounting
├── index.html              # HTML shell & font preloading
├── tailwind.config.js      # Utility styling configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies & scripts
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** this repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and verify they compile:
   ```bash
   npm run build
   ```
4. Check linting guidelines:
   ```bash
   npm run lint
   ```
5. Commit your changes: `git commit -m 'Add some feature'`.
6. Push to your branch: `git push origin feature/your-feature-name`.
7. Submit a **Pull Request**.

---

## 📄 License

This project is private and proprietary.
