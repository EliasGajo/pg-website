from fastapi import FastAPI, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from src.audio_to_text import Audio_to_text
from src.chat_gpt_bot import Chat_gpt_bot
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

@app.get("/factures")
async def root():
    return {"message": "API message"}

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
async def root(prompt: str = Body(...)):
    chat_gpt_bot = Chat_gpt_bot()
    result = chat_gpt_bot.send_prompt(prompt)
    return {"message": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)