#!/usr/bin/env bash

# =====================================================================
#    🚀 Q9 AI - Production RAG Agent Platform (Linux / macOS Launcher)
#    منظومة الاستخبارات المعرفية واستنطاق المستندات
# =====================================================================

set -e

echo "=== Starting Q9 AI Platform ==="

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[!] python3 could not be found. Please install Python 3.10+."
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "[!] node could not be found. Please install Node.js 18+."
    exit 1
fi

# Env Setup
if [ ! -f .env ]; then
    echo "[*] Creating .env from .env.example..."
    cp .env.example .env
fi

if [ ! -f backend/.env ]; then
    echo "[*] Creating backend/.env from backend/.env.example..."
    cp backend/.env.example backend/.env
fi

echo "[*] Starting Backend (FastAPI)..."
(cd backend && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000) &
BACKEND_PID=$!

echo "[*] Starting Frontend (Next.js)..."
npm run dev &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "Shutting down Q9 AI services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

echo ""
echo "[✓] Systems running:"
echo "    - Frontend: http://localhost:3000"
echo "    - Backend:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services."

wait
