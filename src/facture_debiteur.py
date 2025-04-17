import pandas as pd

class Facture_debiteur:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportFACALL.json')
        df = df['FACALL']

        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'REFFOR': 'Référence',
            'DAECRI': 'Date écriture',
            'DATECH': 'Date échéance',
            'MONTTC': 'Montant TTC',
            'SOPIEC': 'SOPIEC',
            'NORAPPD': 'Etat',
            'DAEMRA': 'DAEMRA',
            'DAECRA': 'DAECRA',
            'NOMGFA': 'Nom'
        }
        return traductions
