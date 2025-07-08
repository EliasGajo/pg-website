import pandas as pd

class Divers_debiteur:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportDIVDEBIT.json')
        df = df['DIVDEBIT']

        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'DATFAC': 'Date facture',
            'DEPLDD': 'Description',
            'FACCOD': 'Date de comptabilisation',
            'FACCOM': 'Comptabilisé',
            'MNTFAC': 'Montant',
            'NOLOCO': 'Locataire',
            'NOIMME': 'Immeuble'
        }
        return traductions
