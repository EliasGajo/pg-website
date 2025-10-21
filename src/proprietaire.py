import pandas as pd

class Proprietaire:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportTESTELIAS.json')
        df = df['TESTELIAS']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'REIMME': 'Référence immeuble',
            'REPROP': 'REPROP',
            'NOINTE': 'Nom',
            'PRINTE': 'Prénom',
            'NOEMAI': 'Email',
            'DAFIMA': 'Date fin mandat immeuble',
            'TYIMMED': 'Type immeuble'
        }
        return traductions
