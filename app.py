from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi import Request
import io
import os
import json
from src.audio_to_text import Audio_to_text
from src.chat_gpt_bot import Chat_gpt_bot
from src.facture_debiteur import Facture_debiteur
from src.divers_debiteur import Divers_debiteur
from src.tournus_immeuble import Tournus_immeuble
from src.moyen_paiement import Moyen_paiement
from src.coproprietaire import Coproprietaire
from src.locataire import Locataire
from src.proprietaire import Proprietaire
from src.etat_locatif import EtatLocatif
from src.qr_multiple import QrMultiple
from src.locataire_export_grille import LocataireExportGrille
from src.communus import Communus
from src.document import Document
from src.contentieux import Contentieux
from src.element_bail import ElementBail
from src.export_email import ExportEmail
from src.excel import Excel
from src.enqueteNE import EnqueteNE
import uvicorn
import tempfile
import win32com.client
import datetime

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

@app.get("/divers-debiteur")
async def root(request: Request):
    #data = await request.json()
    values = Divers_debiteur.get_all()
    traductions = Divers_debiteur.get_traduction()
    return {
            "values": values,
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

@app.get("/moyen-paiement")
async def root(request: Request):
    #data = await request.json()
    values = Moyen_paiement.get_all()
    traductions = Moyen_paiement.get_traduction()
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

@app.get("/locataire")
async def root(request: Request):
    #data = await request.json()
    values = Locataire.get_all()
    traductions = Locataire.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/locataire-export-grille")
async def root(request: Request):
    #data = await request.json()
    values = LocataireExportGrille.get_all()
    traductions = LocataireExportGrille.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/proprietaire")
async def root(request: Request):
    #data = await request.json()
    values = Proprietaire.get_all()
    traductions = Proprietaire.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/etat-locatif")
async def root(request: Request):
    #data = await request.json()
    values = EtatLocatif.get_all()
    traductions = EtatLocatif.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/comunus-EL")
async def root(request: Request):
    #data = await request.json()
    values = Communus.get_el()
    traductions = Communus.get_el_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/comunus-sinistres")
async def root(request: Request):
    #data = await request.json()
    values = Communus.get_sinistres()
    traductions = Communus.get_sinistres_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/comunus-vacants")
async def root(request: Request):
    #data = await request.json()
    values = Communus.get_vacants()
    traductions = Communus.get_vacants_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/enquete-vacants-logements")
async def root(request: Request):
    #data = await request.json()
    values = EnqueteNE.get_vacants_logements()
    traductions = EnqueteNE.get_vacants_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/enquete-vacants-commercial")
async def root(request: Request):
    #data = await request.json()
    values = EnqueteNE.get_vacants_commercial()
    traductions = EnqueteNE.get_vacants_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/enquete-objets-commercial")
async def root(request: Request):
    #data = await request.json()
    values = EnqueteNE.get_objets_commercial()
    traductions = EnqueteNE.get_objets_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/enquete-objets-logement")
async def root(request: Request):
    #data = await request.json()
    values = EnqueteNE.get_objets_logement()
    traductions = EnqueteNE.get_objets_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/qr-multiple")
async def root(request: Request):
    values = QrMultiple.get_all()
    traductions = QrMultiple.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/document")
async def root(request: Request):
    #data = await request.json()
    values = Document.get_all()
    traductions = Document.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/contentieux")
async def root(request: Request):
    #data = await request.json()
    values = Contentieux.get_all()
    traductions = Contentieux.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/element-bail")
async def root(request: Request):
    #data = await request.json()
    values = ElementBail.get_all()
    traductions = ElementBail.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.get("/export-email")
async def root(request: Request):
    #data = await request.json()
    values = ExportEmail.get_all()
    traductions = ExportEmail.get_traduction()
    return {
            "values": values,
            "traductions": traductions
            }

@app.post("/merge-excel")
async def merge_excel(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    final_columns_ordered: str = Form(...),  # Reçoit le JSON du frontend
    dedup_columns: str = Form(...)
):
    # Convertir JSON en liste de dicts
    final_columns_ordered = json.loads(final_columns_ordered)
    dedup_cols = json.loads(dedup_columns)

    output = Excel.merge_excels(
        io.BytesIO(await file1.read()),
        io.BytesIO(await file2.read()),
        final_columns_ordered,
        dedup_cols
    )

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=merged.xlsx"}
    )

@app.post("/get-columns")
async def get_columns(file: UploadFile = File(...)):
    return Excel.get_columns(io.BytesIO(await file.read()))

def evaluate_rules(item, rules):
    for rule in rules:
        cond = rule.get("condition", {})
        operator = cond.get("operator")

        if operator == "else":
            return rule["color"]

        field = cond.get("field")
        value = item.get(field)

        if operator == "not_empty" and value not in (None, "", []):
            return rule["color"]

        if operator == "empty" and value in (None, "", []):
            return rule["color"]

    return None

def hex_to_excel_color(hex_color: str) -> int:
    hex_color = hex_color.lstrip("#")

    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)

    # Excel = BGR
    return (b << 16) + (g << 8) + r

@app.post("/export-excel")
async def export_excel(request: Request):
    payload = await request.json()

    data = payload.get("data", [])
    template_name = payload.get("template_name")
    start_row = payload.get("start_row", 1)
    start_col = payload.get("start_col", 1)
    rules = payload.get("rules", [])

    template_path = os.path.join('data', template_name)

    if not os.path.exists(template_path):
        return {"error": "Template not found"}

    # 👉 fichier temporaire pour la sortie
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
    temp_path = temp_file.name
    temp_file.close()

    # 👉 lancer Excel
    excel = win32com.client.Dispatch("Excel.Application")
    excel.Visible = False
    excel.DisplayAlerts = False

    try:
        wb = excel.Workbooks.Open(os.path.abspath(template_path))
        ws = wb.Sheets(1)

        columns_to_fill = []

        # ✅ Détection des colonnes utilisables (fusion incluses)
        if data and len(data) > 0:
            nb_data_columns = len(data[0])
            column_iterator = start_col

            while len(columns_to_fill) < nb_data_columns:
                cell = ws.Cells(start_row, column_iterator)

                if cell.MergeCells:
                    merge_area = cell.MergeArea
                    first_col = merge_area.Column

                    if first_col not in columns_to_fill:
                        columns_to_fill.append(first_col)
                else:
                    columns_to_fill.append(column_iterator)

                column_iterator += 1

            # ✅ Insertion des données
            for i, item in enumerate(data):
                row_num = start_row + i

                color_value = False
                if rules:
                    color_value = hex_to_excel_color(evaluate_rules(item, rules))

                for j, (key, value) in enumerate(item.items()):
                    if j >= len(columns_to_fill):
                        break

                    col_num = columns_to_fill[j]  # ✅ UTILISATION CORRECTE

                    # conversion timestamps JS → date Excel
                    if isinstance(value, (int, float)) and value > 1e10:
                        value = datetime.datetime.fromtimestamp(value / 1000)

                    cell = ws.Cells(row_num, col_num)

                    # ✅ gérer fusion proprement
                    if cell.MergeCells:
                        cell = cell.MergeArea.Cells(1, 1)

                    # ✅ gérer les valeurs nulles
                    if value is None:
                        value = ""

                    # ✅ sécuriser les types
                    if not isinstance(value, (str, int, float, datetime.datetime)):
                        value = str(value)

                    cell.Value = value

                    # ✅ WrapText peut planter → protéger
                    try:
                        cell.WrapText = True
                    except Exception:
                        pass

                    if color_value:
                        try:
                            cell.Interior.Color = color_value
                        except Exception:
                            pass

        wb.SaveAs(os.path.abspath(temp_path))
        wb.Close(False)


    finally:
        excel.Quit()

    # 👉 retour du fichier
    filename = os.path.basename(template_name).replace(".xlsx", "_export.xlsx")

    return FileResponse(
        path=temp_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

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