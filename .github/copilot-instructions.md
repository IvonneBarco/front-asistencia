# Emaús Mujeres - Asistencia con Flores

## Project Context
Community attendance system with gamification for a Catholic women's community called "Emaús Mujeres".

## Core Principles
- Recognition over competition
- Warm, respectful, sober, and modern UI
- Mobile-first design
- Discreet gamification
- Positive and human language

## Semantic Requirements
- ✅ Use "flores" (flowers) instead of "points"
- ✅ Use "Jardín de Emaús" instead of "leaderboard"
- ✅ Use "orden de flores" instead of "ranking"
- ✅ Use "asistencia" for attendance

## Visual Identity
- Logo: cross + butterfly (sobriety + transformation)
- Primary color: #6B3A1E (brown cross)
- Background: #FAF9F7
- Accents: #1F4FD8, #F2C94C, #D64545 (max one per view)
- Typography: Inter or Source Sans 3 for body, Playfair Display for titles
- Linear, minimalist iconography
- No butterfly repetition outside logo

## Tech Stack
- React 18
- TypeScript
- Vite
- React Router
- React Query (@tanstack/react-query)
- html5-qrcode for QR scanning
- PWA (manifest + service worker)
- JWT authentication with localStorage

## Project Structure
```
src/
├── assets/          # Images, fonts, icons
├── components/      # Reusable UI components
│   ├── ui/         # Base components (Button, Card, Badge)
│   └── layout/     # Layout components
├── views/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API client
├── types/          # TypeScript definitions
├── context/        # React Context (Auth)
├── styles/         # Global styles, tokens
└── utils/          # Utility functions
```

## API Endpoints
- POST /auth/login
- POST /attendance/scan
- GET /leaderboard
- GET /me

## Development Status
- [x] Created copilot-instructions.md
- [x] Project scaffold
- [x] Dependencies installed
- [x] Design system implemented
- [x] Components created
- [x] Views implemented
- [x] PWA configured
- [x] Build verified
