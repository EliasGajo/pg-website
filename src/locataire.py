import pandas as pd

class Locataire:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportLOCAALL.json')
        df = df['LOCAALL']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'REFFOR': 'Référence',
            'NOLOCO': 'Nom locataire',
            'DEOBJED': 'Description objet',
            'SURFOB': 'Surface',
            'ETAGESD': 'Etage',
            'REIMME': 'Réf immeuble',
            'NOIMME': 'Nom immeuble',
            'DADELO': 'Date début location',
            'DASOAC': 'Date sortie acceptée',
            'MNTDU': 'Montant dû',
            'DAFIMA': 'Date de fin de mandat',
            'LOVACA': 'Vacant',
            'NOEMAI': 'Email',
            'CONTEN': 'Contentieux',
            'CONTEND': 'Contentieux desc',
            'ARRANG': 'Arrangement'
        }
        return traductions
