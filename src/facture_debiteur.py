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
            'MNTFAC': 'Montant HT',
            'MNTTOT': 'Montant TTC',
            'MNTTVA': 'Montant TVA',
            'NORAPPD': 'Etat',
            'NOMGFA': 'Nom qui facture',
            'REFGEN': 'N° Immeuble',
            'DATFAC': 'Date facture',
            'NOMGEN': 'Nom'
        }
        return traductions
