import pandas as pd

class QrMultiple:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportBVRGROUPE.json')
        df = df['BVRGROUPE']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'DAEMDD': 'Date émission',
            'DEBVRM': 'Désignation',
            'MONBVR': 'Montant QR total',
            'MTCOMP': 'Montant',
            'REFFOR': 'Référence'
        }
        return traductions
