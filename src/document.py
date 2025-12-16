import pandas as pd

class Document:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportBUREALL.json')
        df = df['BUREALL']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'DEDBURD': 'Destinataire',
            'TYDBUR_DESI': 'Nom locataire',
            'INICOL': 'Initiales collaborateur',
            'DACREA': 'Date de création',
            'REDBUD': 'Nom dossier',
            'REDBUL': 'Nom lettre',
            'LETTRE_DESI': 'Référence lettre',
            'DEDBUL': 'Désignation lettre'
        }
        return traductions
