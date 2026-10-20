<div align="center">

# Notespace — Notes App v2.0

Modern, modular, and responsive note-taking web dashboard built with **Vanilla JavaScript**, **W3C Web Components**, **CSS Grid**, and **Webpack 5**, powered by **RESTful Notes API v2**.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Webpack](https://img.shields.io/badge/Webpack-5.98-8DD6F9?logo=webpack&logoColor=black)](https://webpack.js.org/)
[![Web Components](https://img.shields.io/badge/Web_Components-Custom_Elements-29B6F6)](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
[![SweetAlert2](https://img.shields.io/badge/UI-SweetAlert2-F06292)](https://sweetalert2.github.io/)
[![Anime.js](https://img.shields.io/badge/Animation-Anime.js-FF4081)](https://animejs.com/)
[![Prettier](https://img.shields.io/badge/Code_Style-Prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## Overview

**Notespace** is an enterprise-grade front-end web application developed as the capstone submission for the Dicoding Front-End Web Developer curriculum. It features a complete asynchronous data cycle with Dicoding's Notes REST API v2, native custom elements, fluid stagger animations, and zero heavy frameworks (React/Vue/Angular).

---

## Key Features

- **Full RESTful API Integration**: Dynamic synchronization (Fetch API) with `https://notes-api.dicoding.dev/v2` for creating, reading, archiving, and deleting notes.
- **W3C Web Components**: Custom elements (`<app-bar>`, `<app-sidebar>`, `<note-input>`, `<note-item>`, `<note-list>`, `<loading-indicator>`) utilizing `observedAttributes` and lifecycle callbacks.
- **Asynchronous Loading Indicator**: Accessible `<loading-indicator>` component providing immediate visual feedback during HTTP requests.
- **Note Archival Flow**: Dedicated active and archive filter workflows with live badge counter synchronization.
- **Real-Time Form Validation**: Instant character count limiter, input touch listeners, dynamic validation messages, and reactive submit state.
- **Interactive UI Feedback**: Elegant dialog confirmations and toast notifications powered by **SweetAlert2**.
- **Fluid Stagger Animations**: Smooth card entry transitions orchestrated with **Anime.js**.
- **Responsive CSS Grid Layout**: Adaptive auto-fill grid layout seamlessly scaling from 320px mobile viewports to ultra-wide displays.
- **Modern Build Pipeline**: Multi-environment bundling (`development` & `production`) with **Webpack 5**, `html-webpack-plugin`, and `style-loader`.
- **Automated Code Formatting**: Enforced formatting standard with **Prettier** and custom `.prettierrc`.

---

## Custom Elements Architecture

| Custom Element        | Responsibility                                                      | Observed Attributes                                            |
| --------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------- |
| `<app-bar>`           | Navigation brand bar, search filter, and mobile drawer trigger      | `title`                                                        |
| `<app-sidebar>`       | Navigation panel filtering all, active, and archived states         | `active-filter`, `count-all`, `count-active`, `count-archived` |
| `<note-input>`        | Realtime validation form with counter and dispatch event            | `max-length`                                                   |
| `<note-item>`         | Isolated note card displaying date, status badge, and actions       | `note-id`, `note-title`, `note-body`, `created-at`, `archived` |
| `<note-list>`         | Responsive CSS Grid container with filter/search engine & animation | `filter`, `search-query`                                       |
| `<loading-indicator>` | Accessible modal spinner overlay for HTTP network states            | `loading`, `message`                                           |

---

## API Endpoints Consumed

All network operations are abstracted inside `src/api.js` using native `fetch()`:

| Method   | Endpoint                | Description                          |
| -------- | ----------------------- | ------------------------------------ |
| `GET`    | `/notes`                | Fetches all active notes             |
| `GET`    | `/notes/archived`       | Fetches all archived notes           |
| `POST`   | `/notes`                | Creates a new note (`title`, `body`) |
| `POST`   | `/notes/{id}/archive`   | Archives a specific note             |
| `POST`   | `/notes/{id}/unarchive` | Restores an archived note to active  |
| `DELETE` | `/notes/{id}`           | Permanently deletes a note           |

---

## Project Structure

```text
notes-app/
├── dist/                      # Webpack production build output
│   ├── bundle.[hash].js
│   └── index.html
├── src/
│   ├── api.js                 # Centralized Fetch API abstraction layer
│   ├── app.js                 # Main application controller & event wiring
│   └── components.js          # Definitions for 6 Web Components
├── .md/
│   ├── design.md              # Visual design token specifications
│   └── prd.md                 # Product Requirements Document
├── .gitignore                 # Excluded directories (node_modules, dist, zip)
├── .prettierrc                # Prettier code formatting rules
├── index.html                 # Main HTML template
├── package.json               # NPM scripts and dependencies
├── README.md                  # Project documentation
├── style.css                  # Design system tokens and layout styles
├── webpack.common.js          # Shared Webpack configuration
├── webpack.dev.js             # Development server configuration
└── webpack.prod.js            # Production optimization configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation

1. Clone or extract this repository:

   ```bash
   git clone <repository-url>
   cd notes-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Mode

Run the local development server with hot-reload via `webpack-dev-server`:

```bash
npm run start-dev
```

The application will automatically launch at `http://localhost:8080`.

### Production Build

Compile and bundle the project for production into the `dist/` folder:

```bash
npm run build
```

### Code Formatting

Format all source files using Prettier:

```bash
npm run format
```

---

## Submission Criteria Checklist (5-Star Target)

- [x] **Kriteria Wajib 1**: Mempertahankan seluruh kriteria submission sebelumnya (Web Components, CSS Grid, validasi form).
- [x] **Kriteria Wajib 2**: Memanfaatkan RESTful API `https://notes-api.dicoding.dev/v2` (tambah, tampil, hapus) dan menghapus data lokal/dumi.
- [x] **Kriteria Wajib 3**: Webpack module bundler (`html-webpack-plugin`, `npm run start-dev`, `npm run build`).
- [x] **Kriteria Wajib 4**: Asynchronous request menggunakan Fetch API.
- [x] **Kriteria Wajib 5**: Indikator loading via Web Component `<loading-indicator>`.
- [x] **Kriteria Opsional 1**: Fitur arsip dan batal arsip catatan.
- [x] **Kriteria Opsional 2**: Feedback visual dan error dialog dengan SweetAlert2.
- [x] **Kriteria Opsional 3**: Animasi kartu catatan menggunakan Anime.js.
- [x] **Kriteria Opsional 4**: Prettier code formatter terkonfigurasi di `.prettierrc`.

---

## License

This project is licensed under the [ISC License](LICENSE) for educational and submission purposes at Dicoding Academy.
