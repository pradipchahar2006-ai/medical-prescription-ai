# Prescription OCR

A local web app for uploading prescription images, extracting text with PaddleOCR, classifying extracted lines, and organizing the result with Gemini. Processed prescription records are saved in MongoDB.

> **Important:** This is a demonstration project, not a medical device or source of medical advice. OCR and AI results can be wrong and must be checked by a qualified person. Do not use the synthetic training data as clinical evidence.

## Project layout

- `client/` — React 19 and Vite frontend.
- `server/` — Express API, prescription persistence, and temporary upload handling.
- `ai-server/` — Flask OCR and classification service, medicine-name lookup data, and the pre-trained `prescription_classifier.joblib` model.
- `ai-server/PresExtract_AI_120000_Synthetic_Dataset/` — synthetic data used by `train_model.py`.

The app's frontend runs on port `5173`, the Express API on `5000`, and the AI service on `8000`. The Vite development server proxies `/api` requests to Express.

## Prerequisites

- Node.js `20.19+` or `22.12+` and npm.
- Python 3.11 or newer.
- A running MongoDB instance, local or hosted.
- A Gemini API key. The AI service sends extracted prescription text to Gemini for structuring.
- Internet access on the AI service's first run so PaddleOCR can download its model files.

## Setup

Run commands from the repository root unless a command first changes directory.

### 1. Configure secrets

Create local environment files from the examples:

**PowerShell**

```powershell
if (-not (Test-Path server\.env)) { Copy-Item server\.env.example server\.env }
if (-not (Test-Path ai-server\.env)) { Copy-Item ai-server\.env.example ai-server\.env }
```

**macOS/Linux**

```sh
[ -f server/.env ] || cp server/.env.example server/.env
[ -f ai-server/.env ] || cp ai-server/.env.example ai-server/.env
```

Set `MONGODB_URI` in `server/.env` to your MongoDB connection string and `GEMINI_API_KEY` in `ai-server/.env` to your Gemini API key. Keep these files private; `.env` files are excluded by `.gitignore`.

### 2. Install dependencies

```sh
cd server
npm ci
cd ../client
npm ci
cd ../ai-server
python -m venv .venv
```

Activate the Python environment, then install the AI service dependencies:

**PowerShell**

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

**macOS/Linux**

```sh
source .venv/bin/activate
python -m pip install -r requirements.txt
```

If PowerShell prevents virtual-environment activation, use the Python executable directly instead: `.\.venv\Scripts\python.exe -m pip install -r requirements.txt`.

### 3. Start the app

Start MongoDB, then run each service in its own terminal from the repository root:

**AI service**

```sh
cd ai-server
```

Activate the virtual environment as shown above, then run:

```sh
python ai_server.py
```

**Express API**

```sh
cd server
node server.js
```

**Frontend**

```sh
cd client
npm run dev
```

Open the URL printed by Vite (normally <http://localhost:5173>). The AI service loads the bundled model at startup; its first run may download PaddleOCR model files.

## Useful frontend commands

Run these from `client/`:

```sh
npm run lint
npm run build
npm run preview
```

The Express package does not currently define a test suite. The Python classifier can be retrained with `python train_model.py` from `ai-server/`; this requires the synthetic dataset files in `PresExtract_AI_120000_Synthetic_Dataset/`.

## GitHub and large/local files

The root `.gitignore` excludes dependencies, Python virtual environments, secrets, generated uploads, and `ai-server/medicine_data.csv`. That CSV is over GitHub's 100 MB per-file limit; it is not required for inference or classifier training, but `build_medicine_dictionary.py` can use it when rebuilding the medicine-name dictionaries. The smaller `medicine_dataset.csv` and the generated dictionaries are included. If you need to distribute the large CSV, use an appropriate external data host or Git LFS.

Before publishing, review `git status --short` and confirm no secrets, prescription images, or other private data are staged. If a real API key has already been exposed or committed, revoke/rotate it; removing it from the latest file alone does not remove it from Git history.

To publish this folder as a new GitHub repository, from the repository root:

```sh
git init
git add .
git status --short
git commit -m "Initial project upload"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPOSITORY>.git
git push -u origin main
```
