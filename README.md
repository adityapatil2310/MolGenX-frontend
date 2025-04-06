The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


# MolGenX Backend

Backend service for the MolGenX drug discovery platform that handles molecule generation, optimization, and protein-ligand interaction analysis.

## Prerequisites

- Python 3.11.9
- Virtual Environment

## Setup Instructions

### 1. Create and Activate Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Activate virtual environment (Linux/MacOS)
source .venv/bin/activate

#Install Dependencies 
pip install -r requirements.txt

```

### Local Development

```bash

 python main.py

 # This will start server at http://localhost:8080

```

### API Endpoints

- POST: /api/optimize
    
    Request Body: 
    ```json
    {
        "protein": "SEQUENCE" or "pdb_id": "ID",
        "weights": {
            "druglikeness": 1.0,
            "synthetic_accessibility": 0.8,
            "lipinski_violations": 0.7,
            "toxicity": 1.2,
            "binding_affinity": 1.5,
            "solubility": 0.6
        }
    }
    ```