from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Ajout du middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",  # Liste des origines autorisées
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les en-têtes
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/factures")
async def root():
    return {"message": "Hello Factures"}