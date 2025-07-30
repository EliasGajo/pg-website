import pandas as pd

class LocataireExportGrille:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_excel('data/ega_Export_XLS4.xlsx')
        df = df.loc[:, ~df.columns.str.contains("Unnamed")]
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {
        }
        return traductions
