import pandas as pd

class Communus:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_el():
        df = pd.read_json('data/ega_ExportCOMUNUS.json')
        df = df['COMUNUS']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_el_traduction():
        traductions = {
            'V_OBJLOC': 'Référence',
            'ETAGESA': 'Etage',
            'MONMEN': 'Loyer mensuel',
            'GEOBJED': 'Genre objet',
            'NBPIEC': 'Nombre de pièces',
            'surface': 'Surface'
        }
        return traductions
