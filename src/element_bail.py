import pandas as pd

class ElementBail:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_all():
        df = pd.read_csv(
            "data/ega_Export.csv",
            encoding="latin-1",
            sep=";",
            header=1,
            on_bad_lines="skip"
        )
        header_values = list(df.columns)
        df = df[~df.apply(lambda row: row.astype(str).tolist() == header_values, axis=1)]
        df = df.reset_index(drop=True)
        return df.to_json(orient='records')
    
    @staticmethod
    def get_traduction():
        traductions = {}
        return traductions
