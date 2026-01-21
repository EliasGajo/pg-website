import pandas as pd

class ExportEmail:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_csv(
            "data/emails.csv",
            sep=",",
            quotechar='"',
            encoding="utf-8",
            engine="python"
        )
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {}
        return traductions
