import pandas as pd

class EnqueteNE:

    def __init__(self, filter):

        self.filter = filter
    
    @staticmethod
    def get_vacants():
        vacants = pd.read_excel('data/enqueteNE/vacants.xlsx')
        df_final = vacants
        return df_final.to_json(orient='records')
    
    @staticmethod
    def get_vacants_traduction():
        traductions = {}
        return traductions
