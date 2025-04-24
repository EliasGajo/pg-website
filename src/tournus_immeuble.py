import pandas as pd

class Tournus_immeuble:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_excel('data/ega_Export_XLS.xlsx')

        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'Réf.': 'Référence'
        }
        return traductions
