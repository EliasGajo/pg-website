import pandas as pd

class Contentieux:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportPGCOLO02.json')
        df = df['PGCOLO02']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'REFFOR': 'Référence',
            'NOMLOS': 'Nom locataire',
            'RUBRIQ': 'Rubrique',
            'INICOL': 'Collaborateur',
            'MONTAN': 'Montant',
            'MONTDU': 'Montant dû',
            'TYCOIMD': 'Type contentieux',
            'NOIMME': 'Immeuble'
        }
        return traductions
