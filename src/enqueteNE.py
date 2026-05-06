import pandas as pd
import re

class EnqueteNE:

    def __init__(self, filter):

        self.filter = filter
    
    @staticmethod
    def get_vacants():
        vacants = pd.read_excel('data/enqueteNE/vacants.xlsx')
        def clean_rue(val):
            if not isinstance(val, str):
                return val

            # 👉 protection des vrais noms de type "8 Mai", "11 Novembre"
            if re.search(r"\d+\s+[A-Za-zÀ-ÿ]{2,}", val):
                return re.sub(r"\s+\d+\s*[A-Za-zÀ-ÿ]*$", "", val).strip()

            # 👉 suppression du numéro de ce qui suit
            return re.sub(r"\s+\d.*$", "", val).strip()
        vacants["Rue"] = vacants["Rue"].apply(clean_rue)
        df_final = vacants
        return df_final.to_json(orient='records')
    
    @staticmethod
    def get_vacants_traduction():
        traductions = {}
        return traductions
