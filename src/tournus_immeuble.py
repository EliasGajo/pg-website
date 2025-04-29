import pandas as pd

class Tournus_immeuble:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_excel('data/ega_Export_XLS.xlsx')
        df = df.drop(['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3'], axis=1)
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
            'Réf.': 'Référence'
        }
        return traductions
