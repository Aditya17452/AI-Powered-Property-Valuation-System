
# IntelliValue — Indore Property Valuation System

Quick start

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Notes:
- The backend loads the trained model from `../Dataset/property_valuation_model.pkl` — do not retrain or replace this file.
- Ensure your `.env` contains `GROQ_API_KEY` for LLM explanations.
- The frontend dev server proxies `/api` to `http://localhost:8000`.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# AI Powered Property Valuation System

A full-stack app to estimate residential property values using a trained model and web UI. This repository contains a Python FastAPI backend that serves a price prediction model and a modern frontend (React/Vite + Next-style structure) for user interaction, data collection, and agent-driven explanations.

## Key features
- ML-based property valuation using a saved model (`vigyan_nagar_price_model.cbm`).
- Backend API for valuations, explanations, and validation (`backend/`).
- Frontend UI for entering property details and viewing results (`frontend/` / `src/`).
- Agents for explanation, validation and valuation logic (`backend/agents/`).
- Dataset scripts and training utilities under `Dataset/`.

## Repository layout
- `backend/` — FastAPI app, agents, model loader, and related scripts.
  - `main.py` — API entrypoint.
  - `config.py` — configuration values.
  - `agents/` — `explanation_agent.py`, `validation_agent.py`, `valuation_agent.py`.
  - `vigyan_nagar_price_model.cbm` — serialized model used for predictions.
- `frontend/` — UI code (React, Vite) and components.
  - `src/` — React app (legacy) and `app/` (newer Next-style pages/components).
- `Dataset/` — data collection, scrapers, training scripts, and CSV datasets.
- `model/` — model helper (e.g., `predictor.py`).
- `README.md` — this file.

## Tech stack
- Backend: Python, FastAPI, Uvicorn, common ML libs (scikit-learn / lightgbm / custom model loader).
- Frontend: React, Vite, Tailwind CSS (and Next-style app directory in `frontend/app`).
- Data & training: pandas, scikit-learn (training scripts in `Dataset/`).

## Getting started

Prerequisites
- Python 3.8+ and pip
- Node 16+ and npm/yarn
- Git (for cloning)

Backend (API)
1. Create and activate a Python virtual environment:
   - Windows (PowerShell)
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt

