import pandas as pd

class EtatLocatif:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_json('data/ega_ExportPGEGID.json')
        df = df['PGEGID']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
        }
        return traductions
