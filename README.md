<div align="center">

# 🚀 Q9 AI — Production RAG Agent
### منظومة الاستخبارات المعرفية واستنطاق المستندات المؤسسية
**Enterprise-Grade Retrieval-Augmented Generation (RAG) Platform**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Production-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Qdrant-Vector%20DB-dc2626?logo=qdrant" alt="Qdrant" />
  <img src="https://img.shields.io/badge/Offline-Air--Gapped%20Ready-emerald" alt="Air-Gapped" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
</p>

[**English**](#-english-overview) | [**العربية**](#-نظرة-عامة-باللغة-العربية) | [**Quickstart**](#-quickstart-in-3-minutes) | [**Architecture**](#-architecture) | [**Configuration**](#-configuration)

</div>

---

## 📖 English Overview

**Q9 AI (Production RAG Agent)** is a full-stack, enterprise-grade Retrieval-Augmented Generation (RAG) platform designed to build private, intelligent AI assistants over complex document repositories.

Instead of relying solely on an LLM's static training weights (which suffer from hallucinations and outdated information), Q9 retrieves verified semantic context directly from your documents, injects that context into the reasoning prompt, and outputs **deterministic, evidence-grounded answers with exact page, paragraph, and source citations**.

The system is engineered for production reliability, offering:
- **Resilient Document Ingestion**: Ingests PDFs with complex tables, DOCX, PPTX, XLSX, TXT, and Markdown.
- **Deterministic Chunking & Deduplication**: Hashes text chunks to prevent redundant vector storage and reduce embedding costs.
- **Multi-Provider AI Architecture**: Native support for local offline models (**LM Studio**, **Ollama**, **vLLM**) and cloud providers (**Google Gemini**, **OpenAI**).
- **Query Caching (0.13s)**: In-memory cache delivers sub-second responses for repeated organizational queries.
- **Full Air-Gapped & Sovereign Privacy**: Can run 100% offline inside private networks without external API leakage.
- **Luxury Next.js Frontend**: Pure high-contrast White / Obsidian Dark themes, interactive 3D volumetric core, markdown reports export, and source citation inspector.

---

## 🇸🇦 نظرة عامة باللغة العربية

**منظومة Q9 للذكاء الاصطناعي (Production RAG Agent)** هي منصة استرجاع-توليد معزز (RAG) متكاملة ومفتوحة المصدر، صُممت لبناء مساعدين أذكياء لاستنطاق المستندات الخاصة والبيانات الحساسة.

بدلاً من الاعتماد الأعمى على المعرفة المسبقة للنماذج اللغوية (LLMs) المعرضة للهلوسة، يقوم النظام باسترداد المعلومات الأكثر دقة من مستنداتك باستخدام **البحث الدلالي الهجين**، ويضيف هذا السياق الحقيقي للموجه لتوليد **استجابات قطعية قائمة على الأدلة مع توثيق المصدر ورقم الصفحة والفقرة**.

---

## ⭐ Key Capabilities / أبرز المزايا

| الميزة / Feature | الوصف / Description |
| :--- | :--- |
| **📂 Multi-Format Ingestion** | دعم شامل لملفات: PDF, DOCX, PPTX, XLSX, CSV, TXT, Markdown. |
| **🔍 Hybrid Vector Search** | بحث شعاعي دلالي فائق السرعة عبر **Qdrant** مع تصنيف الاستعلامات. |
| **⚡ Quantum Query Cache** | استجابة فورية خلال **0.13 ثانية** للأسئلة المكررة والشائعة. |
| **🛡️ Zero-Hallucination Citations** | توثيق إلزامي لكل حقيقة بالاسم، رقم الصفحة، الفقرة الأصلية، ونسبة التطابق. |
| **🌐 Offline & Air-Gapped** | تشغيل محلي 100% عبر نماذج LM Studio أو Ollama بدون الحاجة للإنترنت. |
| **🔄 Multi-Turn Dialogue** | سياق حواري متصل يتذكر تفاصيل الجلسة ويسمح بالاستفسارات التتبعية. |
| **📑 Executive Markdown Export** | تصدير كامل الحوار والإجابات المعتمدة بتنسيق تقرير موثق بنقرة واحدة. |
| **🎨 Luxury UI / UX** | واجهة تفاعلية بصرية حديثة تدعم التبديل الفوري بين الأبيض الكامل والأسود الفاخر. |

---

## 🏗️ Architecture

```text
[ User / Client ]
       │
       ▼
[ Next.js 15 App Router Frontend (Port 3000) ]
       │  (HTTP / Streaming SSE)
       ▼
[ FastAPI Backend (Port 8000) ]
       ├── Query Cache (0.13s Fast Path)
       ├── Ingestion Pipeline (PDF, Word, Excel, Markdown)
       ├── Deterministic Chunking & Hash Deduplication
       └── LangGraph Multi-Turn Orchestrator
             │
             ├──► [ Qdrant Vector DB (Port 6333) ] ── (Embeddings & Semantic Search)
             └──► [ LLM Engine (Port 1234 / Cloud) ] ── (LM Studio, Ollama, or Gemini)
```

---

## ⚡ Quickstart in 3 Minutes

### Prerequisites
- **Python**: 3.10 or 3.11
- **Node.js**: 18+ and npm
- **Vector DB**: Qdrant running locally (via Docker or standalone binary on port 6333)
- **Model Engine**: LM Studio / Ollama (port 1234 / 11434) OR a Google Gemini API Key

---

### Option A: One-Click Launcher (Recommended)

#### On Windows:
Double-click `run.bat` or run in terminal:
```cmd
run.bat
```

#### On Linux / macOS:
```bash
chmod +x run.sh
./run.sh
```

This automatically checks dependencies, creates `.env` files if missing, launches FastAPI and Next.js, and opens your browser at `http://localhost:3000`.

---

### Option B: Manual Step-by-Step Setup

#### 1. Clone the repository
```bash
git clone https://github.com/manafalbana710-hash/Production-RAG-Agent.git
cd Production-RAG-Agent
```

#### 2. Configure Environment Files
```bash
# Frontend
cp .env.example .env

# Backend
cp backend/.env.example backend/.env
```

#### 3. Start Qdrant Vector Database
Using Docker:
```bash
docker run -d -p 6333:6333 -p 6334:6334 -v qdrant_storage:/qdrant/storage qdrant/qdrant
```

#### 4. Setup and Run Backend (FastAPI)
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: **`http://localhost:8000/docs`**

#### 5. Setup and Run Frontend (Next.js)
Open a new terminal in the project root:
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## ⚙️ Configuration

The system uses `backend/.env` for all AI provider and database settings:

### Local Offline Model (LM Studio / Ollama):
```env
LLM_PROVIDER=lmstudio
EMBEDDING_PROVIDER=lmstudio
LOCAL_BASE_URL=http://localhost:1234/v1
LOCAL_LLM_MODEL=default
LOCAL_EMBEDDING_MODEL=nomic-embed-text
EMBEDDING_DIMENSION=768
```

### Cloud Model (Google Gemini):
```env
LLM_PROVIDER=gemini
EMBEDDING_PROVIDER=gemini
GOOGLE_API_KEY=AIzaSyYourKeyHere...
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=models/gemini-embedding-001
EMBEDDING_DIMENSION=3072
```

---

## 📂 Project Structure

```text
Production-RAG-Agent/
├── app/                        # Next.js 15 App Router pages
│   ├── page.tsx               # Luxury Landing Page with 3D Core & Demo
│   ├── chat/                  # Q9 AI Studio (Document Chat Interface)
│   ├── dashboard/             # Management Console & Ingestion Metrics
│   └── documents/             # Knowledge Base & File Manager
├── backend/                    # FastAPI Server & Python Core
│   ├── app/
│   │   ├── main.py            # FastAPI Entrypoint & Routes
│   │   ├── core/              # Config, Logging & Query Cache
│   │   ├── services/          # Ingestion, Chunking, Deduplication, Qdrant
│   │   └── graph/             # LangGraph RAG Agent & Prompt Logic
│   ├── requirements.txt       # Python Dependencies
│   └── Dockerfile             # Production Container Spec
├── components/                 # Reusable React & UI Components
│   ├── chat/                  # Chat Studio & Citation Preview Modal
│   ├── corporate/             # Interactive Demo Console & Corporate Elements
│   ├── layout/                # App Header, App Shell, Theme Switcher
│   └── ui/                    # 3D Core, 3D Cards, Buttons, Inputs
├── lib/                        # State Management, Context, API Clients
├── run.bat                     # 1-Click Windows Launcher
├── run.sh                      # 1-Click Linux/macOS Launcher
└── README.md                   # Project Documentation
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Developed with pride by <b>Q9 Technologies Inc.</b> • Made for the Global Open-Source Community</sub>
</div>
