import pandas as pd

class Coproprietaire:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_excel('data/ega_ExportCOPRALL.xlsx')
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'NOIMME': 'Immeuble',
            'REFFOR': 'Référence',
            'NOLOCO': 'Nom',
            'MOYPAID': 'Moyen de paiement',
            'NOEMAI': 'Email'
        }
        return traductions
