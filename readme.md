# Mame Tools - Personal Website

Personal website built with Next.js 14, TypeScript, and Ant Design.

## Features

- 🎨 Dark theme with blue color scheme
- ✨ Glass morphism effects (iOS-style)
- 📱 Responsive design
- ⚡ Built with Next.js 14 App Router
- 🎯 TypeScript for type safety
- 🎭 Ant Design UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Home page
│   └── tools/          # My Tools page
├── components/         # React components
│   ├── Navbar.tsx      # Navigation component
│   └── HomeSection.tsx # Home page content
├── theme/              # Theme configuration
│   └── antd-theme.ts  # Ant Design theme settings
├── lib/                # Utility functions
│   └── AntdRegistry.tsx # Ant Design CSS-in-JS registry
└── public/             # Static assets
    └── assets/         # Images and files
```

## Assets

Make sure to copy your assets (logo.svg, CV.pdf) from the root `assets/` folder to `web/public/assets/` directory.

## Build

To build for production:

```bash
npm run build
# or
yarn build
```

To start production server:

```bash
npm start
# or
yarn start
```

## Customization

- Theme colors can be adjusted in `theme/antd-theme.ts`
- Glass effect styles are defined in `app/globals.css`
- Component styles are in their respective `.module.css` files
