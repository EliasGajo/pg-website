from fastapi import FastAPI, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from src.audio_to_text import Audio_to_text
from src.chat_gpt_bot import Chat_gpt_bot
from src.facture_debiteur import Facture_debiteur
from src.tournus_immeuble import Tournus_immeuble
from src.coproprietaire import Coproprietaire
import uvicorn

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

@app.get("/facture-debiteur")
async def root(request: Request):
    #data = await request.json()
    factures = Facture_debiteur.get_all()
    traductions = Facture_debiteur.get_traduction()
    return {
            "factures": factures,
            "traductions": traductions
            }

@app.get("/tournus-immeuble")
async def root(request: Request):
    #data = await request.json()
    values = Tournus_immeuble.get_all()
    traductions = Tournus_immeuble.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/coproprietaire")
async def root(request: Request):
    #data = await request.json()
    values = Coproprietaire.get_all()
    traductions = Coproprietaire.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.post("/audio-to-text")
async def root(file: UploadFile = File(...)):
    audio_data = await file.read()
    filename = f"{file.filename}.wav"
    with open(filename, "wb") as f:
        f.write(audio_data)
    audio_to_text = Audio_to_text()
    result = audio_to_text.translation_to_french(filename)
    return {"message": result}

@app.post("/ask_to_chat_gpt")
async def root(request: Request):
    data = await request.json()
    prompt = data['input']
    chat_gpt_bot = Chat_gpt_bot()
    result = chat_gpt_bot.send_prompt(prompt)
    return {"message": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, ssl_certfile="enregistrement-audio/ssl/certificate.crt", ssl_keyfile="enregistrement-audio/ssl/private.key")